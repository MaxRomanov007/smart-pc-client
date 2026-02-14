import { createAuthClient } from "better-auth/react";
import {
  genericOAuthClient,
  inferAdditionalFields,
} from "better-auth/client/plugins";
import { auth, SSO_PROVIDER_ID } from "@/utils/auth/server";
import { useCallback, useEffect, useState } from "react";
import { unauthorized } from "next/dist/client/components/unauthorized";

export const authClient = createAuthClient({
  plugins: [genericOAuthClient(), inferAdditionalFields<typeof auth>()],
});

export type User = typeof authClient.$Infer.Session.user;

export function useToken() {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { data: session } = authClient.useSession();

  const fetchToken = useCallback(async () => {
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
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    fetchToken();
  }, [fetchToken]);

  return { token, fetchToken, loading, session };
}
