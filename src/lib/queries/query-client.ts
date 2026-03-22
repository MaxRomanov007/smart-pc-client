import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import { showError } from "@/utils/errors";
import { AxiosError } from "axios";
import { isNextRouterError } from "next/dist/client/components/is-next-router-error";

type ErrorMessage =
  | "noConnection"
  | "noConnectionDescription"
  | "queryError"
  | "mutationError";
type ErrorMessages = Record<ErrorMessage, string>;

function isNetworkError(error: unknown): boolean {
  return (
    (error instanceof TypeError && error.message === "Failed to fetch") ||
    (error instanceof AxiosError && !error.status)
  );
}

function handleError(
  error: unknown,
  fallbackMessage: string,
  messages: ErrorMessages,
): void {
  if (isNetworkError(error)) {
    showError(messages.noConnection, messages.noConnectionDescription);
    return;
  }
  if (isNextRouterError(error)) {
    return;
  }

  const detail = error instanceof Error ? error.message : String(error);
  showError(fallbackMessage, detail);
}

export function makeQueryClient(messages: ErrorMessages): QueryClient {
  return new QueryClient({
    queryCache: new QueryCache({
      onError: (error, query) => {
        if (
          Array.isArray(query.queryKey) &&
          query.queryKey[0] === "auth-session"
        )
          return;
        handleError(error, messages.queryError, messages);
      },
    }),
    mutationCache: new MutationCache({
      onError: (error) => {
        handleError(error, messages.mutationError, messages);
      },
    }),
    defaultOptions: {
      queries: {
        throwOnError: true,
        retry: (failureCount, error) => {
          if (error instanceof Response && error.status === 401) return false;
          if (isNextRouterError(error)) return false;
          return failureCount < 2;
        },
        staleTime: 5 * 60 * 1000,
      },
      mutations: {
        throwOnError: true,
      },
    },
  });
}
