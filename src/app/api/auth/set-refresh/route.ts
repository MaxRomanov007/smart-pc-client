import { NextRequest, NextResponse } from "next/server";

export const REFRESH_TOKEN_COOKIE = "rt";

export async function POST(request: NextRequest) {
  let body: { refresh_token: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { refresh_token } = body;

  if (!refresh_token) {
    return NextResponse.json(
      { error: "refresh_token is required" },
      { status: 400 },
    );
  }

  const response = NextResponse.json({ ok: true });

  response.cookies.set(REFRESH_TOKEN_COOKIE, refresh_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api/auth",
    maxAge: 60 * 60 * 24 * 30,
  });

  return response;
}
