import { genericOAuth } from "better-auth/plugins";
import { betterAuth } from "better-auth";
import { createAuthClient } from "better-auth/client";
import { genericOAuthClient } from "better-auth/client/plugins";
import { unauthorized } from "next/dist/client/components/unauthorized";
import { headers } from "next/dist/server/request/headers";

export const SSO_PROVIDER_ID = "sso";

export const auth = betterAuth({
  plugins: [
    genericOAuth({
      config: [
        {
          providerId: SSO_PROVIDER_ID,
          discoveryUrl: process.env.SSO_DISCOVERY_URL!,
          clientId: process.env.SSO_CLIENT_ID!,
          clientSecret: process.env.SSO_CLIENT_SECRET!,
          scopes: [
            "openid",
            "offline",
            "users:read",
            "products:read",
            "orders:read",
          ],
          pkce: true,
          accessType: "offline",
          authentication: "basic",
          mapProfileToUser: (options) => {
            return {
              id: options.id,
              email: options.email,
              emailVerified: options.emailVerified,
              image: options.traits?.picture,
              name: [options.name?.first, options.name?.last].join(" "),
            };
          },
        },
      ],
    }),
  ],
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 7 * 24 * 60 * 60,
      strategy: "jwe",
      refreshCache: true,
    },
  },
  account: {
    storeStateStrategy: "cookie",
    storeAccountCookie: true,
  },
});

export const authClient = createAuthClient({
  plugins: [genericOAuthClient()],
});

export const getSession = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    unauthorized();
  }

  return session;
};
