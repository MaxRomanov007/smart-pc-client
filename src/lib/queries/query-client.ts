import { QueryClient } from "@tanstack/react-query";
import { showError } from "@/utils/errors";

function isNetworkError(error: unknown): boolean {
  return error instanceof TypeError && error.message === "Failed to fetch";
}

export function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        throwOnError: false,
        retry: (failureCount, error) => {
          if (error instanceof Response && error.status === 401) return false;
          return failureCount < 2;
        },
      },
      mutations: {
        throwOnError: false,
      },
    },
  });
}

type ErrorMessage =
  | "noConnection"
  | "noConnectionDescription"
  | "queryError"
  | "mutationError";
type ErrorMessages = Record<ErrorMessage, string>;

export function attachGlobalQueryErrorHandler(
  client: QueryClient,
  messages: ErrorMessages,
): void {
  const queryCache = client.getQueryCache();
  const mutationCache = client.getMutationCache();

  queryCache.subscribe((event) => {
    if (event.type !== "updated") return;
    if (event.query.state.status !== "error") return;

    const error = event.query.state.error;
    if (!error) return;

    const queryKey = event.query.queryKey;
    if (Array.isArray(queryKey) && queryKey[0] === "auth-session") return;

    if (isNetworkError(error)) {
      showError(messages.noConnection, messages.noConnectionDescription);
      return;
    }

    const message = error instanceof Error ? error.message : String(error);
    showError(messages.queryError, message);
  });

  mutationCache.subscribe((event) => {
    if (event.type !== "updated") return;
    if (event.mutation?.state.status !== "error") return;

    const error = event.mutation?.state.error;
    if (!error) return;

    if (isNetworkError(error)) {
      showError(messages.noConnection, messages.noConnectionDescription);
      return;
    }

    const message = error instanceof Error ? error.message : String(error);
    showError(messages.mutationError, message);
  });
}
