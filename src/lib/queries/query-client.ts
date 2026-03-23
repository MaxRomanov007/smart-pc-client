import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import { showError } from "@/utils/errors";
import { AxiosError } from "axios";
import { isNextRouterError } from "next/dist/client/components/is-next-router-error";

type ErrorMessage = {
  title: string;
  message: string;
};
type AxiosErrorMessage = (error: AxiosError) => ErrorMessage | undefined;

type ErrorMessages = {
  noConnection: ErrorMessage;
  axiosError: AxiosErrorMessage;
};

function isNoConnectionError(error: unknown): boolean {
  return error instanceof AxiosError && !error.status;
}

function handleError(messages: ErrorMessages): (error: unknown) => void {
  return (error) => {
    if (isNextRouterError(error)) {
      return;
    }

    if (isNoConnectionError(error)) {
      showError(messages.noConnection.title, messages.noConnection.message);
      return;
    }

    if (!(error instanceof AxiosError)) {
      return;
    }

    const message = messages.axiosError(error);
    if (!message) return;

    showError(message.title, message.message);
  };
}

function retry(failureCount: number, error: unknown) {
  if (isNoConnectionError(error)) {
    return failureCount < 2;
  }

  return false;
}

export function makeQueryClient(messages: ErrorMessages): QueryClient {
  return new QueryClient({
    queryCache: new QueryCache({
      onError: handleError(messages),
    }),
    mutationCache: new MutationCache({
      onError: handleError(messages),
    }),
    defaultOptions: {
      queries: {
        throwOnError: isNextRouterError,
        retry: retry,
        staleTime: 5 * 60 * 1000,
      },
      mutations: {
        throwOnError: isNextRouterError,
        retry: retry,
      },
    },
  });
}
