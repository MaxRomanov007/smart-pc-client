"use client";

import { type ReactNode, useEffect } from "react";
import { QueryClient } from "@tanstack/query-core";
import { QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

interface Props {
  children?: ReactNode;
}

export default function QueryProvider({ children }: Props) {
  useEffect(() => {
    window.__TANSTACK_QUERY_CLIENT__ = queryClient;
  }, []);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

declare global {
  interface Window {
    __TANSTACK_QUERY_CLIENT__: QueryClient;
  }
}
