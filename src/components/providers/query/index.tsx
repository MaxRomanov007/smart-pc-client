"use client";

import { type ReactNode, useEffect, useState } from "react";
import { QueryClient } from "@tanstack/query-core";
import { QueryClientProvider } from "@tanstack/react-query";
import {
  attachGlobalQueryErrorHandler,
  makeQueryClient,
} from "@/lib/queries/query-client";

interface Props {
  children?: ReactNode;
}

export default function QueryProvider({ children }: Props) {
  const [queryClient] = useState<QueryClient>(() => makeQueryClient());

  useEffect(() => {
    attachGlobalQueryErrorHandler(queryClient);
  }, [queryClient]);

  useEffect(() => {
    window.__TANSTACK_QUERY_CLIENT__ = queryClient;
  }, [queryClient]);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

declare global {
  interface Window {
    __TANSTACK_QUERY_CLIENT__: QueryClient;
  }
}
