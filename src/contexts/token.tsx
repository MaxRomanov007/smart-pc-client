"use client"

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createAuthClient } from "better-auth/react";
import { genericOAuthClient } from "better-auth/client/plugins";
import { SSO_PROVIDER_ID } from "@/utils/auth/server";
import { unauthorized } from "next/dist/client/components/unauthorized";

export const authClient = createAuthClient({
  plugins: [genericOAuthClient()],
});

type TokenContextType = {
  token: string | null;
  loading: boolean;
  session: ReturnType<typeof authClient.useSession>["data"];
  refreshToken: () => Promise<string | null>;
};

const TokenContext = createContext<TokenContextType | undefined>(undefined);

export function TokenProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { data: session } = authClient.useSession();

  const refreshToken = useCallback(async (force = false) => {
    if (token && !force) return token;

    if (!session) {
      setToken(null);
      return null;
    }

    setLoading(true);
    try {
      const { data, error: tokenError } = await authClient.getAccessToken({
        providerId: SSO_PROVIDER_ID,
      });

      if (tokenError) {
        unauthorized();
      }

      const newToken = data?.accessToken || null;
      setToken(newToken);
      return newToken;
    } catch {
      unauthorized()
    } finally {
      setLoading(false);
    }
  }, [session, token]);

  useEffect(() => {
    refreshToken();
  }, [refreshToken, session]);

  const value = useMemo(
    () => ({
      token,
      loading,
      session,
      refreshToken: () => refreshToken(true),
    }),
    [token, loading, session, refreshToken],
  );

  return (
    <TokenContext.Provider value={value}>{children}</TokenContext.Provider>
  );
}

export function useToken() {
  const context = useContext(TokenContext);
  if (!context) {
    throw new Error("useToken must be used within TokenProvider");
  }
  return context;
}
