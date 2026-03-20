"use client";

import { useEffect } from "react";
import { unauthorized } from "next/navigation";
import { useAuthContextInternal } from "./auth-context";
import type { IAuthContext } from "./types";

export function useAuth(): IAuthContext {
  return useAuthContextInternal();
}

export function useRequireAuth(): IAuthContext {
  const auth = useAuthContextInternal();

  useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated) {
      unauthorized();
    }
  }, [auth]);

  return auth;
}
