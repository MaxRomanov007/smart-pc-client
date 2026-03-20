import { type NextRequest, NextResponse } from "next/server";
import { REFRESH_TOKEN_COOKIE } from "../set-refresh/route";

async function getRevocationEndpoint(): Promise<string | null> {
  try {
    const issuer = process.env.NEXT_PUBLIC_OAUTH_ISSUER;
    if (!issuer) return null;

    const res = await fetch(`${issuer}/.well-known/openid-configuration`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) return null;
    const data = await res.json();
    return (data.revocation_endpoint as string) ?? null;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;

  if (refreshToken) {
    const revocationEndpoint = await getRevocationEndpoint();

    if (revocationEndpoint) {
      try {
        const params = new URLSearchParams({
          token: refreshToken,
          token_type_hint: "refresh_token",
          client_id: process.env.NEXT_PUBLIC_OAUTH_CLIENT_ID!,
        });

        const revokeRes = await fetch(revocationEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: params.toString(),
        });

        if (!revokeRes.ok) {
          console.error("Token revocation failed:", await revokeRes.text());
        }
      } catch (err) {
        console.error("Token revocation network error:", err);
      }
    }
  }

  // Удаляем cookie в любом случае
  const response = NextResponse.json({ ok: true });
  response.cookies.delete(REFRESH_TOKEN_COOKIE);
  return response;
}
