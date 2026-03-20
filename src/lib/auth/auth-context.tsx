"use client";

/**
 * AuthContext.tsx
 *
 * ИСПРАВЛЕНИЯ относительно предыдущей версии:
 *
 * 1. initSession теперь использует полный IRefreshResult (с idToken),
 *    чтобы восстановить user при перезагрузке страницы.
 *
 * 2. isLoading: true по умолчанию — компоненты обязаны ждать
 *    завершения initSession перед рендером защищённого контента.
 *
 * 3. setUserFromIdToken вынесен в контекст для callback страницы.
 *
 * 4. Подписка на auth:session-expired — синхронизирует состояние
 *    когда axios interceptor обнаруживает невосстановимый 401.
 */

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
} from "react";
import { parseUserFromIdToken, tokenStorage } from "./tokens";
import {
  generateChallenge,
  generateState,
  generateVerifier,
  LOGIN_REDIRECT_PATH_KEY,
  PKCE_STATE_KEY,
  PKCE_VERIFIER_KEY,
} from "./pkce";
import type { IAuthContext, IAuthState, IUser } from "./types";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const AUTH_QUERY_KEY = ["auth-session"] as const;
const REFRESH_BEFORE_EXPIRY_S = 60;

interface IAuthContextInternal extends IAuthContext {
  setSessionFromTokens: (
    idToken: string,
    accessToken: string,
    expiresIn: number,
  ) => void;
}

const AuthContext = createContext<IAuthContextInternal | null>(null);

const OAUTH_CONFIG = {
  clientId: process.env.NEXT_PUBLIC_OAUTH_CLIENT_ID!,
  authorizationEndpoint: process.env.NEXT_PUBLIC_OAUTH_AUTH_URL!,
  scope: "openid offline mqtt:pc:read mqtt:pc:state:read mqtt:pc:command:write",
};

interface ISessionData {
  accessToken: string;
  expiresIn: number;
  idToken: string | null;
  user: IUser | null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  const {
    data: session,
    isLoading,
    isFetching,
  } = useQuery<ISessionData | null>({
    queryKey: AUTH_QUERY_KEY,

    queryFn: async (): Promise<ISessionData | null> => {
      const result = await tokenStorage.refresh();
      if (!result) return null;

      return {
        accessToken: result.accessToken,
        expiresIn: result.expiresIn,
        idToken: result.idToken,
        user: result.idToken ? parseUserFromIdToken(result.idToken) : null,
      };
    },

    staleTime: (query) => {
      const data = query.state.data as ISessionData | null | undefined;
      if (!data) return 0;
      return Math.max(data.expiresIn - REFRESH_BEFORE_EXPIRY_S, 5) * 1000;
    },
    refetchOnWindowFocus: true,

    refetchInterval: 30_000,
    refetchIntervalInBackground: false,

    retry: 3,

    // null = пользователь не залогинен, не считаем ошибкой
    throwOnError: false,
  });

  useEffect(() => {
    if (session?.accessToken) {
      tokenStorage.setAccessToken(session.accessToken, session.expiresIn);
    }
  }, [session]);

  // auth:session-expired from axios interceptor
  useEffect(() => {
    const handleSessionExpired = () => {
      // Сбрасываем кэш query — следующий mount вызовет queryFn заново
      queryClient.setQueryData(AUTH_QUERY_KEY, null);
      tokenStorage.clearAccessToken();
    };

    window.addEventListener("auth:session-expired", handleSessionExpired);
    return () => {
      window.removeEventListener("auth:session-expired", handleSessionExpired);
    };
  }, [queryClient]);

  const login = useCallback(async (redirectPath?: string): Promise<void> => {
    const verifier = generateVerifier();
    const challenge = await generateChallenge(verifier);
    const state = generateState();

    sessionStorage.setItem(PKCE_VERIFIER_KEY, verifier);
    sessionStorage.setItem(PKCE_STATE_KEY, state);
    if (redirectPath) {
      sessionStorage.setItem(LOGIN_REDIRECT_PATH_KEY, redirectPath);
    }

    const redirectUri = `${window.location.origin}/auth/callback`;
    const params = new URLSearchParams({
      response_type: "code",
      client_id: OAUTH_CONFIG.clientId,
      redirect_uri: redirectUri,
      scope: OAUTH_CONFIG.scope,
      state,
      code_challenge: challenge,
      code_challenge_method: "S256",
    });

    window.location.href = `${OAUTH_CONFIG.authorizationEndpoint}?${params.toString()}`;
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    await tokenStorage.logout();
    queryClient.setQueryData(AUTH_QUERY_KEY, null);
    queryClient.removeQueries({ queryKey: AUTH_QUERY_KEY });
  }, [queryClient]);

  const getValidToken = useCallback(async (): Promise<string | null> => {
    const current = tokenStorage.getAccessToken();
    if (current && !tokenStorage.isAccessTokenExpiringSoon()) return current;

    const result = await queryClient.fetchQuery<ISessionData | null>({
      queryKey: AUTH_QUERY_KEY,
      queryFn: async () => {
        const r = await tokenStorage.refresh();
        if (!r) return null;
        return {
          accessToken: r.accessToken,
          expiresIn: r.expiresIn,
          idToken: r.idToken,
          user: r.idToken ? parseUserFromIdToken(r.idToken) : null,
        };
      },
      staleTime: 0,
    });

    return result?.accessToken ?? null;
  }, [queryClient]);

  const setSessionFromTokens = useCallback(
    (idToken: string, accessToken: string, expiresIn: number) => {
      const user = parseUserFromIdToken(idToken);
      tokenStorage.setAccessToken(accessToken, expiresIn);

      const sessionData: ISessionData = {
        accessToken,
        expiresIn,
        idToken,
        user,
      };
      queryClient.setQueryData(AUTH_QUERY_KEY, sessionData);
    },
    [queryClient],
  );

  const state: IAuthState = {
    user: session?.user ?? null,
    accessToken: session?.accessToken ?? null,
    isAuthenticated: !!session?.accessToken,
    isLoading: isLoading || isFetching,
    error: null,
  };

  const value: IAuthContextInternal = {
    ...state,
    login,
    logout,
    getValidToken,
    setSessionFromTokens,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContextInternal(): IAuthContextInternal {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
