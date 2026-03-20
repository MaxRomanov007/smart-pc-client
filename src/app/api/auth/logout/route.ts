/**
 * app/api/auth/logout/route.ts — выход из системы
 *
 * Удаляет httpOnly cookie с refresh_token.
 * access_token в памяти очищается на клиенте в AuthContext.
 *
 * Опционально: можно отозвать токен на OAuth сервере через revocation endpoint.
 */

import { type NextRequest, NextResponse } from "next/server";
import { REFRESH_TOKEN_COOKIE } from "../set-refresh/route";

export async function POST(request: NextRequest) {
  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;

  // Опционально: отзываем refresh_token на OAuth сервере
  // Это предотвращает его использование даже если cookie утёк
  if (refreshToken && process.env.NEXT_PUBLIC_OAUTH_REVOCATION_URL) {
    try {
      const params = new URLSearchParams({
        token: refreshToken,
        token_type_hint: "refresh_token",
        client_id: process.env.NEXT_PUBLIC_OAUTH_CLIENT_ID!,
      });

      await fetch(process.env.NEXT_PUBLIC_OAUTH_REVOCATION_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      });
    } catch (error) {
      // Логируем но не блокируем logout — пользователь должен выйти
      console.error("Failed to revoke token:", error);
    }
  }

  const response = NextResponse.json({ ok: true });

  // Удаляем cookie (устанавливаем с истёкшим maxAge)
  response.cookies.delete(REFRESH_TOKEN_COOKIE);

  return response;
}
