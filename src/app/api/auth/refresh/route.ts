import { type NextRequest, NextResponse } from "next/server";
import { REFRESH_TOKEN_COOKIE } from "../set-refresh/route";

async function getTokenEndpoint(): Promise<string> {
  const issuer = process.env.NEXT_PUBLIC_OAUTH_ISSUER;
  if (!issuer) throw new Error("NEXT_PUBLIC_OAUTH_ISSUER is not set");

  const res = await fetch(`${issuer}/.well-known/openid-configuration`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) throw new Error("OIDC discovery failed");
  const data = await res.json();
  return data.token_endpoint as string;
}

export async function POST(request: NextRequest) {
  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;

  if (!refreshToken) {
    return NextResponse.json({ error: "No refresh token" }, { status: 401 });
  }

  let tokenEndpoint: string;
  try {
    tokenEndpoint = await getTokenEndpoint();
  } catch (err) {
    console.error("OIDC discovery failed in refresh:", err);
    return NextResponse.json(
      { error: "OIDC discovery failed" },
      { status: 503 },
    );
  }

  const params = new URLSearchParams({
    grant_type: "refresh_token",
    client_id: process.env.NEXT_PUBLIC_OAUTH_CLIENT_ID!,
    refresh_token: refreshToken,
  });

  let tokenResponse: Response;
  try {
    tokenResponse = await fetch(tokenEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });
  } catch (err) {
    console.error("OAuth server unreachable during refresh:", err);
    return NextResponse.json(
      { error: "OAuth server unavailable" },
      { status: 503 },
    );
  }

  if (!tokenResponse.ok) {
    const errorText = await tokenResponse.text();
    console.error("Refresh rejected by Hydra:", errorText);

    const errorResponse = NextResponse.json(
      { error: "Refresh failed" },
      { status: 401 },
    );
    errorResponse.cookies.delete(REFRESH_TOKEN_COOKIE);
    return errorResponse;
  }

  const tokens = await tokenResponse.json();

  const response = NextResponse.json({
    access_token: tokens.access_token,
    expires_in: tokens.expires_in,
  });

  if (tokens.refresh_token && tokens.refresh_token !== refreshToken) {
    response.cookies.set(REFRESH_TOKEN_COOKIE, tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/api/auth",
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  return response;
}
