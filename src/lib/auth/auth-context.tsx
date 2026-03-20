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
  useRef,
  useState,
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
import type { IAuthContext, IAuthState } from "./types";

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

// Как часто "будильник" проверяет дедлайн пока вкладка активна.
// Не критично точное — просто не пропустить окно.
const CHECK_INTERVAL_MS = 30_000; // 30 секунд

// За сколько до истечения токена начинаем refresh
const REFRESH_BEFORE_EXPIRY_S = 60;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<IAuthState>({
    user: null,
    accessToken: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Абсолютный timestamp (ms) когда нужно сделать refresh.
  // null = нет активной сессии.
  const refreshDeadline = useRef<number | null>(null);

  // Интервал-"будильник" — просто периодически вызывает checkAndRefresh
  const checkInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  // ─── Ядро: проверить дедлайн и при необходимости обновить токен ──────────

  const checkAndRefresh = useCallback(async () => {
    if (refreshDeadline.current === null) return;

    const now = Date.now();

    // Дедлайн ещё не наступил — ничего не делаем
    if (now < refreshDeadline.current) return;

    // Дедлайн наступил (или прошёл — например, вкладка была в фоне)
    const result = await tokenStorage.refresh();

    if (!result) {
      refreshDeadline.current = null;
      setState({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: "Session expired",
      });
      return;
    }

    // Устанавливаем новый дедлайн от нового expires_in
    refreshDeadline.current =
      Date.now() + (result.expiresIn - REFRESH_BEFORE_EXPIRY_S) * 1000;

    setState((prev) => ({
      ...prev,
      accessToken: result.accessToken,
      user: result.idToken
        ? (parseUserFromIdToken(result.idToken) ?? prev.user)
        : prev.user,
      error: null,
    }));
  }, []);

  // ─── Установить дедлайн и запустить будильник ─────────────────────────────

  const startRefreshSchedule = useCallback(
    (expiresIn: number) => {
      // Дедлайн = сейчас + (expiresIn - 60s)
      // Если expiresIn маленький (< 70s) — обновим почти сразу
      refreshDeadline.current =
        Date.now() + Math.max(expiresIn - REFRESH_BEFORE_EXPIRY_S, 5) * 1000;

      // Запускаем периодическую проверку если ещё не запущена
      if (!checkInterval.current) {
        checkInterval.current = setInterval(checkAndRefresh, CHECK_INTERVAL_MS);
      }
    },
    [checkAndRefresh],
  );

  const stopRefreshSchedule = useCallback(() => {
    refreshDeadline.current = null;
    if (checkInterval.current) {
      clearInterval(checkInterval.current);
      checkInterval.current = null;
    }
  }, []);

  // ─── visibilitychange: главная защита от "проспавшего" таймера ───────────

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        // Вкладка стала активной — сразу проверяем дедлайн.
        // Если вкладка была в фоне 30+ минут и токен истёк — обновим мгновенно.
        checkAndRefresh();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [checkAndRefresh]);

  // ─── Инициализация сессии при монтировании ────────────────────────────────

  useEffect(() => {
    const initSession = async () => {
      const result = await tokenStorage.refresh();

      if (result) {
        const user = result.idToken
          ? parseUserFromIdToken(result.idToken)
          : null;

        setState({
          user,
          accessToken: result.accessToken,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });

        startRefreshSchedule(result.expiresIn);
      } else {
        setState({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      }
    };

    initSession();

    const handleSessionExpired = () => {
      stopRefreshSchedule();
      setState({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: "Session expired",
      });
    };

    window.addEventListener("auth:session-expired", handleSessionExpired);

    return () => {
      stopRefreshSchedule();
      window.removeEventListener("auth:session-expired", handleSessionExpired);
    };
  }, [startRefreshSchedule, stopRefreshSchedule]);

  // ─── login ────────────────────────────────────────────────────────────────

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

  // ─── logout ───────────────────────────────────────────────────────────────

  const logout = useCallback(async (): Promise<void> => {
    stopRefreshSchedule();
    await tokenStorage.logout();
    setState({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  }, [stopRefreshSchedule]);

  // ─── getValidToken (для axios interceptor) ────────────────────────────────

  const getValidToken = useCallback(async (): Promise<string | null> => {
    const current = tokenStorage.getAccessToken();
    if (current && !tokenStorage.isAccessTokenExpiringSoon()) {
      return current;
    }
    const result = await tokenStorage.refresh();
    if (result) {
      setState((prev) => ({ ...prev, accessToken: result.accessToken }));
      return result.accessToken;
    }
    return null;
  }, []);

  // ─── setSessionFromTokens (для callback страницы) ────────────────────────

  const setSessionFromTokens = useCallback(
    (idToken: string, accessToken: string, expiresIn: number) => {
      const user = parseUserFromIdToken(idToken);
      tokenStorage.setAccessToken(accessToken, expiresIn);

      setState({
        user,
        accessToken,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      startRefreshSchedule(expiresIn);
    },
    [startRefreshSchedule],
  );

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
