import { cache } from "react";
import { cookies } from "next/headers";
import { REFRESH_TOKEN_COOKIE } from "@/app/api/auth/set-refresh/route";
import type { IUser } from "@/lib/auth/types";

interface IServerAuthResult {
  accessToken: string | null;
  user: IUser | null;
  isAuthenticated: boolean;
}

interface IOryUserInfo {
  sub: string;
  traits?: {
    email?: string;
    name?: { first?: string; last?: string };
    picture?: string;
  };
}

async function getDiscoveryEndpoints(): Promise<{
  token_endpoint: string;
  userinfo_endpoint: string;
} | null> {
  const issuer = process.env.NEXT_PUBLIC_OAUTH_ISSUER;
  if (!issuer) {
    console.error("getServerAuth: NEXT_PUBLIC_OAUTH_ISSUER is not set");
    return null;
  }

  try {
    const res = await fetch(`${issuer}/.well-known/openid-configuration`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;

    const data = await res.json();
    return {
      token_endpoint: data.token_endpoint,
      userinfo_endpoint: data.userinfo_endpoint,
    };
  } catch {
    console.error("getServerAuth: OIDC discovery failed");
    return null;
  }
}

async function fetchUserInfo(
  userinfoEndpoint: string,
  accessToken: string,
): Promise<IUser | null> {
  try {
    const res = await fetch(userinfoEndpoint, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });

    if (!res.ok) return null;

    const info: IOryUserInfo = await res.json();

    return {
      id: info.sub,
      email: info.traits?.email ?? "",
      name: {
        first: info.traits?.name?.first ?? "",
        last: info.traits?.name?.last ?? "",
      },
      picture: info.traits?.picture ?? "",
    };
  } catch {
    console.error("getServerAuth: /userinfo request failed");
    return null;
  }
}

export const getServerAuth = cache(async (): Promise<IServerAuthResult> => {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;

  if (!refreshToken) {
    return { accessToken: null, user: null, isAuthenticated: false };
  }

  const endpoints = await getDiscoveryEndpoints();
  if (!endpoints) {
    return { accessToken: null, user: null, isAuthenticated: false };
  }

  const params = new URLSearchParams({
    grant_type: "refresh_token",
    client_id: process.env.NEXT_PUBLIC_OAUTH_CLIENT_ID!,
    refresh_token: refreshToken,
  });

  let accessToken: string;
  try {
    const tokenRes = await fetch(endpoints.token_endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
      cache: "no-store",
    });

    if (!tokenRes.ok) {
      return { accessToken: null, user: null, isAuthenticated: false };
    }

    const tokens = await tokenRes.json();
    accessToken = tokens.access_token;
  } catch {
    console.error("getServerAuth: token refresh request failed");
    return { accessToken: null, user: null, isAuthenticated: false };
  }

  const user = await fetchUserInfo(endpoints.userinfo_endpoint, accessToken);

  return {
    accessToken,
    user,
    isAuthenticated: true,
  };
});
