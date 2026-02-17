"use client";

import type { ReactNode } from "react";
import { authConfig } from "@/config/auth";
import dynamic from "next/dynamic";

const PKCEProvider = dynamic(
  () => import("react-oauth2-code-pkce").then((mod) => mod.AuthProvider),
  { ssr: false },
);

export default function AuthProvider({ children }: { children: ReactNode }) {
  return <PKCEProvider authConfig={authConfig}>{children}</PKCEProvider>;
}
