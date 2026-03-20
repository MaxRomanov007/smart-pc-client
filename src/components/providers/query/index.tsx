"use client";

import { type ReactNode, useEffect, useState } from "react";
import { QueryClient } from "@tanstack/query-core";
import { QueryClientProvider } from "@tanstack/react-query";
import {
  attachGlobalQueryErrorHandler,
  makeQueryClient,
} from "@/lib/queries/query-client";
import { useExtracted } from "next-intl";

interface Props {
  children?: ReactNode;
}

export default function QueryProvider({ children }: Props) {
  const [queryClient] = useState<QueryClient>(() => makeQueryClient());
  const t = useExtracted("query-provider");

  useEffect(() => {
    attachGlobalQueryErrorHandler(queryClient, {
      noConnection: t({
        message: "No connection",
        description: "no connection error message",
      }),
      noConnectionDescription: t({
        message: "Check your internet connection",
        description: "no connection error description message",
      }),
      queryError: t({
        message: "Error loading data",
        description: "query error message",
      }),
      mutationError: t({
        message: "Operation error",
        description: "mutation error message",
      }),
    });
  }, [queryClient, t]);

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
