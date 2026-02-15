import NextAuth, { type DefaultSession } from "next-auth";

export const ROMANOV_DIGITAL_PROVIDER_ID = "sso";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;

      name: {
        first: string;
        last: string;
      };

      accessToken: string;
    } & DefaultSession["user"];
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    {
      id: ROMANOV_DIGITAL_PROVIDER_ID,
      name: "Romanov Digital",
      type: "oauth",
      issuer: "http://kratos:4444/",
      clientId: process.env.SSO_CLIENT_ID,
      clientSecret: process.env.SSO_CLIENT_SECRET,
      authorization: { params: { scope: "openid offline" } },
      checks: ["state"],
      userinfo: "http://kratos:4444/userinfo",
      token: "http://kratos:4444/oauth2/token",
    },
  ],
  callbacks: {
    jwt({ token, account }) {
      if (account) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          accessTokenExpires: account.expires_at
            ? account.expires_at * 1000
            : Date.now() + (account.expires_in ?? 3600) * 1000,
          idToken: account.id_token,
          userID: account.providerAccountId,
        };
      }

      if (Date.now() < (token.accessTokenExpires as number)) {
        return token;
      }

      return refreshAccessToken(token as never);
    },
    async session(params) {
      return {
        ...params.session,
        user: {
          ...params.session.user,
          id: params.token.userID as string,
          name: params.session.user?.name,
          accessToken: params.token.accessToken,
        },
      };
    },
  },
});

async function refreshAccessToken(token: {
  accessToken: string;
  refreshToken: string;
}) {
  try {
    const response = await fetch("http://kratos:4444/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          `${process.env.SSO_CLIENT_ID}:${process.env.SSO_CLIENT_SECRET}`,
        ).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: token.refreshToken,
        client_id: process.env.SSO_CLIENT_ID ?? "",
      }),
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    console.error("Failed to refresh access token", error);

    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}
