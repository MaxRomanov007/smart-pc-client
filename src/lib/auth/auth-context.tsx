"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
} from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { parseUserFromIdToken, tokenStorage } from "./tokens";
import {
  generateChallenge,
  generateState,
  generateVerifier,
  LOGIN_REDIRECT_PATH_KEY,
  PKCE_STATE_KEY,
  PKCE_VERIFIER_KEY,
} from "./pkce";
import { getOidcDiscovery } from "./discovery";
import type { IAuthContext, IAuthState, ISessionData, IUser } from "./types";

export const AUTH_QUERY_KEY = ["auth-session"] as const;
const AUTH_USER_STORAGE_KEY = "auth_user";

interface IAuthContextInternal extends IAuthContext {
  setSessionFromTokens: (
    idToken: string | undefined,
    accessToken: string,
    expiresIn: number,
  ) => void;
}

const AuthContext = createContext<IAuthContextInternal | null>(null);

const OAUTH_SCOPE =
  "openid offline mqtt:pc:read mqtt:pc:state:read mqtt:pc:command:write";

const REFRESH_BEFORE_EXPIRY_S = 60;

function saveUser(user: IUser): void {
  try {
    sessionStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user));
  } catch {}
}

function loadUser(): IUser | null {
  try {
    const raw = sessionStorage.getItem(AUTH_USER_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as IUser) : null;
  } catch {
    return null;
  }
}

function clearUser(): void {
  try {
    sessionStorage.removeItem(AUTH_USER_STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  const { data: session, isLoading } = useQuery<ISessionData | null>({
    queryKey: AUTH_QUERY_KEY,

    queryFn: async (): Promise<ISessionData | null> => {
      const result = await tokenStorage.refresh();
      if (!result) return null;
      return {
        accessToken: result.access_token,
        expiresIn: result.expires_in,
      };
    },

    staleTime: (query) => {
      const data = query.state.data as ISessionData | null | undefined;
      if (!data) return 0;
      return Math.max(data.expiresIn - REFRESH_BEFORE_EXPIRY_S, 5) * 1000;
    },

    refetchOnWindowFocus: true,

    retry: 2,
    throwOnError: false,
  });

  const user = session ? loadUser() : null;

  useEffect(() => {
    if (session?.accessToken) {
      tokenStorage.setAccessToken(session.accessToken, session.expiresIn);
    }
  }, [session]);

  useEffect(() => {
    const handleSessionExpired = () => {
      queryClient.setQueryData(AUTH_QUERY_KEY, null);
      queryClient.removeQueries({ queryKey: AUTH_QUERY_KEY });
      tokenStorage.clearAccessToken();
      clearUser();
    };

    window.addEventListener("auth:session-expired", handleSessionExpired);
    return () => {
      window.removeEventListener("auth:session-expired", handleSessionExpired);
    };
  }, [queryClient]);

  const login = useCallback(async (redirectPath?: string): Promise<void> => {
    const discovery = await getOidcDiscovery();

    const verifier = generateVerifier();
    const challenge = await generateChallenge(verifier);
    const state = generateState();

    sessionStorage.setItem(PKCE_VERIFIER_KEY, verifier);
    sessionStorage.setItem(PKCE_STATE_KEY, state);
    if (redirectPath) {
      sessionStorage.setItem(LOGIN_REDIRECT_PATH_KEY, redirectPath);
    }

    const redirectUri = `${window.location.origin}/auth/callback`;

    const params = new URLSearchParams({
      response_type: "code",
      client_id: process.env.NEXT_PUBLIC_OAUTH_CLIENT_ID!,
      redirect_uri: redirectUri,
      scope: OAUTH_SCOPE,
      state,
      code_challenge: challenge,
      code_challenge_method: "S256",
    });

    window.location.href = `${discovery.authorization_endpoint}?${params.toString()}`;
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    await tokenStorage.logout();

    queryClient.setQueryData(AUTH_QUERY_KEY, null);
    queryClient.removeQueries({ queryKey: AUTH_QUERY_KEY });
    clearUser();
  }, [queryClient]);

  const getValidToken = useCallback(async (): Promise<string | null> => {
    const current = tokenStorage.getAccessToken();
    if (current && !tokenStorage.isAccessTokenExpiringSoon()) return current;

    // Принудительный refetch через queryClient
    const result = await queryClient.fetchQuery<ISessionData | null>({
      queryKey: AUTH_QUERY_KEY,
      queryFn: async () => {
        const r = await tokenStorage.refresh();
        if (!r) return null;
        return { accessToken: r.access_token, expiresIn: r.expires_in };
      },
      staleTime: 0,
    });

    return result?.accessToken ?? null;
  }, [queryClient]);

  const setSessionFromTokens = useCallback(
    (idToken: string | undefined, accessToken: string, expiresIn: number) => {
      tokenStorage.setAccessToken(accessToken, expiresIn);

      if (idToken) {
        const user = parseUserFromIdToken(idToken);
        if (user) saveUser(user);
      }

      queryClient.setQueryData(AUTH_QUERY_KEY, {
        accessToken,
        expiresIn,
      } satisfies ISessionData);
    },
    [queryClient],
  );

  const state: IAuthState = {
    user,
    accessToken: session?.accessToken ?? null,
    isAuthenticated: !!session?.accessToken,
    isLoading,
    error: null,
  };

  const value: IAuthContextInternal = {
    ...state,
    login,
    logout,
    getValidToken,
    setSessionFromTokens,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContextInternal(): IAuthContextInternal {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
