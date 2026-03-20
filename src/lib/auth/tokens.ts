import type { IOryIdTokenPayload, ITokenResponse, IUser } from "./types";

export interface IRefreshResult {
  accessToken: string;
  expiresIn: number;
  idToken: string | null;
}

const REFRESH_THRESHOLD_SECONDS = 60;

class TokenStorage {
  // access_token живёт только здесь — в модульном замыкании
  private accessToken: string | null = null;
  private accessTokenExpiresAt: number | null = null;

  // Мьютекс: если 2+ запроса одновременно получили 401,
  // только один делает реальный HTTP запрос на refresh,
  // остальные ждут того же Promise.
  private refreshPromise: Promise<IRefreshResult | null> | null = null;

  setAccessToken(token: string, expiresIn: number): void {
    this.accessToken = token;
    this.accessTokenExpiresAt = Date.now() + expiresIn * 1000;
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  isAccessTokenExpiringSoon(): boolean {
    if (!this.accessTokenExpiresAt) return true;
    return (
      Date.now() > this.accessTokenExpiresAt - REFRESH_THRESHOLD_SECONDS * 1000
    );
  }

  isAccessTokenExpired(): boolean {
    if (!this.accessTokenExpiresAt) return true;
    return Date.now() > this.accessTokenExpiresAt;
  }

  clearAccessToken(): void {
    this.accessToken = null;
    this.accessTokenExpiresAt = null;
  }

  async exchangeCode(
    code: string,
    verifier: string,
    redirectUri: string,
  ): Promise<ITokenResponse> {
    const params = new URLSearchParams({
      grant_type: "authorization_code",
      client_id: process.env.NEXT_PUBLIC_OAUTH_CLIENT_ID!,
      code,
      code_verifier: verifier,
      redirect_uri: redirectUri,
    });

    const response = await fetch(process.env.NEXT_PUBLIC_OAUTH_TOKEN_URL!, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Token exchange failed: ${error}`);
    }

    const tokens: ITokenResponse = await response.json();

    this.setAccessToken(tokens.access_token, tokens.expires_in);

    if (tokens.refresh_token) {
      await this.persistRefreshToken(tokens.refresh_token);
    }

    return tokens;
  }

  async refresh(): Promise<IRefreshResult | null> {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = this.doRefresh().finally(() => {
      this.refreshPromise = null;
    });

    return this.refreshPromise;
  }

  async logout(): Promise<void> {
    this.clearAccessToken();
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch {}
  }

  private async doRefresh(): Promise<IRefreshResult | null> {
    try {
      const response = await fetch("/api/auth/refresh", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        this.clearAccessToken();
        return null;
      }

      const data: {
        access_token: string;
        expires_in: number;
        id_token: string | null;
      } = await response.json();

      this.setAccessToken(data.access_token, data.expires_in);

      return {
        accessToken: data.access_token,
        expiresIn: data.expires_in,
        idToken: data.id_token,
      };
    } catch (networkError) {
      console.error("Refresh network error:", networkError);
      return null;
    }
  }

  private async persistRefreshToken(refreshToken: string): Promise<void> {
    try {
      await fetch("/api/auth/set-refresh", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
    } catch (error) {
      console.error("Failed to persist refresh token:", error);
    }
  }
}

export const tokenStorage = new TokenStorage();

export function parseUserFromIdToken(idToken: string): IUser | null {
  try {
    const parts = idToken.split(".");
    if (parts.length !== 3) return null;

    const payload = parts[1]
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .padEnd(parts[1].length + ((4 - (parts[1].length % 4)) % 4), "=");

    const decoded: IOryIdTokenPayload = JSON.parse(atob(payload));

    return {
      id: decoded.sub,
      email: decoded.traits?.email ?? "",
      name: {
        first: decoded.traits?.name?.first ?? "",
        last: decoded.traits?.name?.last ?? "",
      },
      picture: decoded.traits?.picture ?? "",
    };
  } catch {
    return null;
  }
}
