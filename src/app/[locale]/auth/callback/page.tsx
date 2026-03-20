"use client";

/**
 * auth/callback/page.tsx — обработка OAuth callback
 *
 * После того как пользователь авторизовался на OAuth сервере,
 * он редиректится сюда с ?code=...&state=...
 *
 * Этот компонент:
 * 1. Проверяет state (защита от CSRF)
 * 2. Берёт PKCE verifier из sessionStorage
 * 3. Обменивает code на tokens
 * 4. Очищает sessionStorage
 * 5. Редиректит на целевую страницу
 */

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useAuthContextInternal } from "@/lib/auth/auth-context";
import { tokenStorage } from "@/lib/auth/tokens";
import {
  LOGIN_REDIRECT_PATH_KEY,
  PKCE_STATE_KEY,
  PKCE_VERIFIER_KEY,
} from "@/lib/auth/pkce";
import { AbsoluteCenter, Spinner, Text, VStack } from "@chakra-ui/react";
import { useExtracted } from "next-intl";
import { useRouter } from "@/i18n/navigation";

export default function AuthCallback() {
  const t = useExtracted("auth-callback-page");
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setSessionFromTokens, logout } = useAuthContextInternal();

  // Защита от двойного запуска в React Strict Mode
  const isProcessing = useRef(false);

  useEffect(() => {
    if (isProcessing.current) return;
    isProcessing.current = true;

    const handleCallback = async () => {
      const code = searchParams.get("code");
      const returnedState = searchParams.get("state");
      const errorParam = searchParams.get("error");

      if (errorParam) {
        const description =
          searchParams.get("error_description") ?? "Unknown error";
        console.error("OAuth error:", errorParam, description);
        router.replace("/");
        return;
      }

      if (!code || !returnedState) {
        console.error("Missing code or state");
        router.replace("/");
        return;
      }

      // Валидация state (защита от CSRF)
      const savedState = sessionStorage.getItem(PKCE_STATE_KEY);
      if (!savedState || savedState !== returnedState) {
        console.error("State mismatch");
        sessionStorage.removeItem(PKCE_STATE_KEY);
        sessionStorage.removeItem(PKCE_VERIFIER_KEY);
        router.replace("/");
        return;
      }

      const verifier = sessionStorage.getItem(PKCE_VERIFIER_KEY);
      if (!verifier) {
        console.error("PKCE verifier missing");
        router.replace("/");
        return;
      }

      // Очищаем sessionStorage до обмена токенов
      sessionStorage.removeItem(PKCE_VERIFIER_KEY);
      sessionStorage.removeItem(PKCE_STATE_KEY);

      try {
        const redirectUri = `${window.location.origin}/auth/callback`;
        const tokens = await tokenStorage.exchangeCode(
          code,
          verifier,
          redirectUri,
        );

        if (tokens.id_token) {
          // Устанавливаем сессию через контекст — это единственный
          // правильный способ обновить React state
          setSessionFromTokens(
            tokens.id_token,
            tokens.access_token,
            tokens.expires_in,
          );
        }

        const redirectPath = sessionStorage.getItem(LOGIN_REDIRECT_PATH_KEY);
        sessionStorage.removeItem(LOGIN_REDIRECT_PATH_KEY);
        router.replace(redirectPath ?? "/");
      } catch (error) {
        console.error("Token exchange failed:", error);
        await logout();
        router.replace("/");
      }
    };

    handleCallback();
  }, [searchParams, router, setSessionFromTokens, logout]);

  return (
    <AbsoluteCenter>
      <VStack gap={4}>
        <Text textStyle="lg">
          {t({
            message: "Completing authorization...",
          })}
        </Text>
        <Spinner size="xl" />
      </VStack>
    </AbsoluteCenter>
  );
}
