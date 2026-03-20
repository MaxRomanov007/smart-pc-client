/**
 * app/api/auth/set-refresh/route.ts
 *
 * Принимает refresh_token от клиента и сохраняет его в httpOnly cookie.
 *
 * ПОЧЕМУ НУЖЕН ОТДЕЛЬНЫЙ ENDPOINT:
 * Браузер не может установить httpOnly cookie через JS (это было бы
 * бессмысленно с точки зрения безопасности). Только HTTP-ответ сервера
 * может установить httpOnly cookie через Set-Cookie заголовок.
 *
 * БЕЗОПАСНОСТЬ:
 * - Принимает только POST
 * - В продакшене стоит добавить CSRF проверку или ограничить origin
 */

import { NextRequest, NextResponse } from "next/server";

// Имя cookie — вынесено в константу для переиспользования
export const REFRESH_TOKEN_COOKIE = "rt"; // короткое имя уменьшает размер заголовка

export async function POST(request: NextRequest) {
  let body: { refresh_token: string; expires_in?: number };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { refresh_token, expires_in } = body;

  if (!refresh_token || typeof refresh_token !== "string") {
    return NextResponse.json(
      { error: "refresh_token is required" },
      { status: 400 },
    );
  }

  const response = NextResponse.json({ ok: true });

  // Устанавливаем refresh_token в httpOnly Secure cookie
  response.cookies.set(REFRESH_TOKEN_COOKIE, refresh_token, {
    httpOnly: true, // JS не может прочитать
    secure: process.env.NODE_ENV === "production", // только HTTPS в продакшене
    sameSite: "lax", // защита от CSRF при навигации
    path: "/api/auth", // cookie отправляется только на /api/auth/*
    // maxAge в секундах: refresh_token обычно живёт дольше access_token
    // Ory Hydra по умолчанию: 30 дней
    maxAge: 60 * 60 * 24 * 30,
  });

  return response;
}
