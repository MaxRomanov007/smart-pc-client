import type { TAuthConfig } from "react-oauth2-code-pkce";

export const authConfig: TAuthConfig = {
  clientId: process.env.NEXT_PUBLIC_OAUTH_CLIENT_ID!,
  authorizationEndpoint: process.env.NEXT_PUBLIC_OAUTH_AUTH_URL!,
  tokenEndpoint: process.env.NEXT_PUBLIC_OAUTH_TOKEN_URL!,
  logoutEndpoint: process.env.NEXT_PUBLIC_OAUTH_LOGOUT_URL!,
  redirectUri:
    typeof window !== "undefined"
      ? `${window.location.origin}/auth/callback`
      : "http://localhost:3000/auth/callback",
  scope: "openid offline mqtt:pc:read mqtt:pc:command:write",
  decodeToken: false,
  autoLogin: false,
  storageKeyPrefix: "SSO_",
};
