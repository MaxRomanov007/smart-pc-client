"use client";

import { useEffect } from "react";
import { useAuthContext } from "react-oauth2-code-pkce";
import { useRouter } from "next/navigation";

export default function AuthCallback() {
  const { token, error } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (token) {
      router.push("/");
    } else if (error) {
      console.error("OAuth error:", error);
      router.push("/?error=auth_failed");
    }
  }, [token, error, router]);

  return <div>Авторизация... Подождите секунду.</div>;
}
