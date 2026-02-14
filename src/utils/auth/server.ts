import { betterAuth } from "better-auth";
import { genericOAuth } from "better-auth/plugins";
import { headers } from "next/dist/server/request/headers";
import { unauthorized } from "next/dist/client/components/unauthorized";
import type { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";

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
          scopes: ["openid", "offline", "mqtt:pc:read"],
          pkce: true,
          accessType: "offline",
          authentication: "basic",
          mapProfileToUser: (profile) => {
            return {
              id: profile.id,
              oid: profile.sub,
              email: profile.email,
              emailVerified: profile.emailVerified,
              image: profile.traits?.picture,
              name: [profile.name?.first, profile.name?.last].join(" "),
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
  user: {
    additionalFields: {
      oid: {
        type: "string",
        input: false,
      },
    },
  },
});

export async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    unauthorized();
  }

  return session;
}

type GetTokenResult = {
  accessToken?: string;
  error?: unknown;
};

export async function getToken(
  requestHeaders?: ReadonlyHeaders,
): Promise<GetTokenResult> {
  if (!requestHeaders) {
    requestHeaders = await headers();
  }
  try {
    const { accessToken } = await auth.api.getAccessToken({
      body: {
        providerId: SSO_PROVIDER_ID,
      },
      headers: requestHeaders,
    });
    return { accessToken };
  } catch (error) {
    unauthorized();
    return { error };
  }
}
