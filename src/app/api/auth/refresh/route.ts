/**
 * app/api/auth/refresh/route.ts — обновление access_token
 *
 * ПОЧЕМУ НЕЛЬЗЯ ДЕЛАТЬ REFRESH С КЛИЕНТА:
 * refresh_token хранится в httpOnly cookie — JS не может его прочитать.
 * Этот Route Handler работает на сервере Next.js и имеет доступ к cookies.
 * Он читает refresh_token, обращается к OAuth серверу, возвращает
 * новый access_token клиенту (но не refresh_token!).
 *
 * Если OAuth сервер вернул новый refresh_token — ротируем его в cookie.
 */

import { type NextRequest, NextResponse } from "next/server";
import { REFRESH_TOKEN_COOKIE } from "../set-refresh/route";

export async function POST(request: NextRequest) {
  // Читаем refresh_token из httpOnly cookie
  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;

  if (!refreshToken) {
    // Нет refresh_token — пользователь не залогинен или сессия истекла
    return NextResponse.json({ error: "No refresh token" }, { status: 401 });
  }

  // Обращаемся к OAuth серверу с сервера Next.js
  const params = new URLSearchParams({
    grant_type: "refresh_token",
    client_id: process.env.NEXT_PUBLIC_OAUTH_CLIENT_ID!,
    refresh_token: refreshToken,
  });

  let tokenResponse: Response;
  try {
    tokenResponse = await fetch(process.env.NEXT_PUBLIC_OAUTH_TOKEN_URL!, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });
  } catch (networkError) {
    console.error("OAuth server unreachable during refresh:", networkError);
    return NextResponse.json(
      { error: "OAuth server unavailable" },
      { status: 503 },
    );
  }

  if (!tokenResponse.ok) {
    console.log(tokenResponse);
    const errorText = await tokenResponse.text();
    console.error("Refresh token rejected by OAuth server:", errorText);

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
    id_token: tokens.id_token ?? null,
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
