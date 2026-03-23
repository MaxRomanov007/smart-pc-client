"use client";

import { type ReactNode, useEffect, useState } from "react";
import { QueryClient } from "@tanstack/query-core";
import { QueryClientProvider } from "@tanstack/react-query";
import { makeQueryClient } from "@/lib/queries/query-client";
import { useExtracted } from "next-intl";

interface Props {
  children?: ReactNode;
}

export default function QueryProvider({ children }: Props) {
  const t = useExtracted("query-provider");
  const [queryClient] = useState<QueryClient>(() =>
    makeQueryClient({
      noConnection: {
        title: t({
          message: "No connection",
          description: "no connection error message",
        }),
        message: t({
          message: "Check your internet connection",
          description: "no connection error description message",
        }),
      },
      axiosError: (error) => {
        if (error.status === 401) return;

        return {
          title: t({
            message: "Unexpected error",
            description: "axios error handler title",
          }),
          message: error.message,
        };
      },
    }),
  );

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
