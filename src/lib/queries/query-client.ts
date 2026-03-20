import { QueryClient } from "@tanstack/react-query";
import { showError } from "@/utils/errors";
import { AxiosError } from "axios";

function isNetworkError(error: unknown): boolean {
  return (
    (error instanceof TypeError && error.message === "Failed to fetch") ||
    (error instanceof AxiosError && !error.status)
  );
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
        staleTime: 5 * 60 * 1000,
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
): () => void {
  const queryCache = client.getQueryCache();
  const mutationCache = client.getMutationCache();

  const queryStatusMap = new Map<string, string>();

  const unsubscribeQuery = queryCache.subscribe((event) => {
    if (event.type !== "updated") return;

    const query = event.query;
    const queryId = query.queryHash;
    const currentStatus = query.state.status;
    const previousStatus = queryStatusMap.get(queryId);

    queryStatusMap.set(queryId, currentStatus);

    if (currentStatus !== "error" || previousStatus === "error") return;

    const error = query.state.error;
    if (!error) return;

    if (Array.isArray(query.queryKey) && query.queryKey[0] === "auth-session")
      return;

    if (isNetworkError(error)) {
      showError(messages.noConnection, messages.noConnectionDescription);
      return;
    }

    const detail = error instanceof Error ? error.message : String(error);
    showError(messages.queryError, detail);
  });

  const shownMutationErrors = new Set<number>();

  const unsubscribeMutation = mutationCache.subscribe((event) => {
    if (event.type !== "updated") return;

    const mutation = event.mutation;
    if (!mutation || mutation.state.status !== "error") return;

    const mutationId = mutation.mutationId;
    if (shownMutationErrors.has(mutationId)) return;
    shownMutationErrors.add(mutationId);

    const error = mutation.state.error;
    if (!error) return;

    if (isNetworkError(error)) {
      showError(messages.noConnection, messages.noConnectionDescription);
      return;
    }

    const detail = error instanceof Error ? error.message : String(error);
    showError(messages.mutationError, detail);
  });

  return () => {
    unsubscribeQuery();
    unsubscribeMutation();
    queryStatusMap.clear();
    shownMutationErrors.clear();
  };
}
