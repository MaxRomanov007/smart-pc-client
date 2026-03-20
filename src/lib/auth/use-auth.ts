"use client";

/**
 * useAuth.ts — публичные хуки для компонентов
 */

import { useEffect } from "react";
import { unauthorized } from "next/navigation";
import { useAuthContextInternal } from "./auth-context";
import type { IAuthContext } from "./types";

/** Основной хук — используй везде где нужен auth */
export function useAuth(): IAuthContext {
  return useAuthContextInternal();
}

/**
 * Хук для защищённых страниц.
 * Редиректит на логин если пользователь не аутентифицирован.
 * Сохраняет текущий путь для возврата после логина.
 */
export function useRequireAuth(): IAuthContext {
  const auth = useAuthContextInternal();

  useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated) {
      unauthorized();
    }
  }, [auth]);

  return auth;
}
