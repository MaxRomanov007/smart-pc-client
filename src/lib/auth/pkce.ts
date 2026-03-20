export const PKCE_VERIFIER_KEY = "pkce_verifier";
export const PKCE_STATE_KEY = "pkce_state";
export const LOGIN_REDIRECT_PATH_KEY = "login_redirect_path";

export function generateVerifier(): string {
  const array = new Uint8Array(32); // 32 bytes → 43 Base64URL символа
  crypto.getRandomValues(array);
  return base64UrlEncode(array);
}

export async function generateChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return base64UrlEncode(new Uint8Array(digest));
}

export function generateState(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return base64UrlEncode(array);
}

function base64UrlEncode(input: Uint8Array): string {
  return btoa(String.fromCharCode(...input))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}
