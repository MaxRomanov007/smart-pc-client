/**
 * pkce.ts — PKCE (Proof Key for Code Exchange) утилиты
 *
 * PKCE предотвращает перехват authorization code злоумышленником:
 * 1. Генерируем случайный verifier (хранится в sessionStorage)
 * 2. Из verifier вычисляем challenge (отправляется на сервер)
 * 3. При обмене кода на токен — отправляем verifier, сервер проверяет
 */

// Ключи sessionStorage — живут только в текущей вкладке
export const PKCE_VERIFIER_KEY = "pkce_verifier";
export const PKCE_STATE_KEY = "pkce_state";
export const LOGIN_REDIRECT_PATH_KEY = "login_redirect_path";

/**
 * Генерирует криптографически стойкий verifier (43–128 символов Base64URL).
 * RFC 7636: A-Z a-z 0-9 - . _ ~
 */
export function generateVerifier(): string {
  const array = new Uint8Array(32); // 32 bytes → 43 Base64URL символа
  crypto.getRandomValues(array);
  return base64UrlEncode(array);
}

/**
 * Вычисляет S256 challenge из verifier.
 * challenge = BASE64URL(SHA256(ASCII(verifier)))
 */
export async function generateChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return base64UrlEncode(new Uint8Array(digest));
}

/**
 * Генерирует криптографически стойкий state параметр (защита от CSRF).
 * Сервер вернёт его в callback — мы проверяем совпадение.
 */
export function generateState(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return base64UrlEncode(array);
}

/**
 * Кодирует Uint8Array в Base64URL (без =, +, /).
 * Стандартный Base64 использует + и / — они конфликтуют с URL.
 */
function base64UrlEncode(input: Uint8Array): string {
  return btoa(String.fromCharCode(...input))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}
