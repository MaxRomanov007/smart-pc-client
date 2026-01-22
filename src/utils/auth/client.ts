import { createAuthClient } from "better-auth/react";
import { genericOAuthClient } from "better-auth/client/plugins";
import { SSO_PROVIDER_ID } from "@/utils/auth/server";
import { use, useCallback, useEffect, useState } from "react";

export const authClient = createAuthClient({
  plugins: [genericOAuthClient()],
});

export type Session = typeof authClient.$Infer.Session;
export type User = typeof authClient.$Infer.Session.user;

export function useToken() {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { data: session } = authClient.useSession();

  const fetchToken = useCallback(async () => {
    if (!session) {
      setToken(null);
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: tokenError } = await authClient.getAccessToken({
        providerId: SSO_PROVIDER_ID,
      });

      if (tokenError) {
        setError(new Error(tokenError.message));
        return null;
      }

      const newToken = data?.accessToken || null;
      setToken(newToken);
      return newToken;
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    fetchToken();
  }, [fetchToken]);

  return { token, fetchToken, loading, error, session };
}
