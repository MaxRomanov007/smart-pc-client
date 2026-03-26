import { type ApiResponse } from "@/types/api/response";
import type { AxiosResponse } from "axios";
import {
  handleApiResponse,
  type HandleApiResponseOptions,
} from "@/lib/axios/handle-api-response";
import {
  handleApiPaginatedResponse,
  type PaginatedResult,
} from "@/lib/axios/handle-api-paginated-response";

function isHandleApiResponseOptions(
  value: unknown,
): value is HandleApiResponseOptions {
  if (value === undefined || value === null) return false;
  if (typeof value !== "object") return false;
  const keys = Object.keys(value);
  return keys.length === 0 || (keys.length === 1 && "errors" in value);
}

function extractOptsAndArgs<A extends unknown[]>(
  args: [...A, HandleApiResponseOptions?],
): { opts: HandleApiResponseOptions | undefined; fnArgs: A } {
  const lastArg = args[args.length - 1];
  const hasOpts = isHandleApiResponseOptions(lastArg);
  return {
    opts: hasOpts ? (lastArg as HandleApiResponseOptions) : undefined,
    fnArgs: (hasOpts ? args.slice(0, -1) : args) as unknown as A,
  };
}

export function handleApiResponseQuery<A extends unknown[], T>(
  fn: (...args: A) => Promise<AxiosResponse<ApiResponse<T> | T>>,
) {
  return (...args: [...A, HandleApiResponseOptions?]): (() => Promise<T>) =>
    () => {
      const { opts, fnArgs } = extractOptsAndArgs(args);
      return fn(...fnArgs).then(handleApiResponse(opts));
    };
}

export function handleApiResponseParametrized<A extends unknown[], T>(
  fn: (...args: A) => Promise<AxiosResponse<ApiResponse<T> | T>>,
) {
  return (opts?: HandleApiResponseOptions): ((...args: A) => Promise<T>) =>
    (...args) => {
      return fn(...args).then(handleApiResponse(opts));
    };
}

export function handleApiResponseQueryMapped<A extends unknown[], T, R>(
  fn: (...args: A) => Promise<AxiosResponse<ApiResponse<T> | T>>,
  mapper: (data: T) => R,
) {
  return (...args: [...A, HandleApiResponseOptions?]): (() => Promise<R>) =>
    () => {
      const { opts, fnArgs } = extractOptsAndArgs(args);
      return fn(...fnArgs)
        .then(handleApiResponse(opts))
        .then(mapper);
    };
}

export function handleApiResponseInfiniteQuery<
  A extends unknown[],
  T,
  Cursor extends string | undefined = string | undefined,
>(fn: (...args: [...A, Cursor]) => Promise<AxiosResponse<ApiResponse<T> | T>>) {
  return (
    ...args: [...A, HandleApiResponseOptions?]
  ): ((context: { pageParam: Cursor }) => Promise<PaginatedResult<T>>) => {
    return ({ pageParam }) => {
      const { opts, fnArgs } = extractOptsAndArgs(args);
      return fn(...fnArgs, pageParam).then(
        handleApiPaginatedResponse<T, unknown, unknown>(opts),
      );
    };
  };
}

export function handleApiResponseInfiniteQueryMapped<
  A extends unknown[],
  T,
  R,
  Cursor extends string | undefined = string | undefined,
>(
  fn: (...args: [...A, Cursor]) => Promise<AxiosResponse<ApiResponse<T> | T>>,
  mapper: (data: T) => R,
) {
  return (
    ...args: [...A, HandleApiResponseOptions?]
  ): ((context: { pageParam: Cursor }) => Promise<PaginatedResult<R>>) => {
    return ({ pageParam }) => {
      const { opts, fnArgs } = extractOptsAndArgs(args);
      return fn(...fnArgs, pageParam)
        .then(handleApiPaginatedResponse<T, unknown, unknown>(opts))
        .then(({ data, nextCursor, prevCursor }) => ({
          data: mapper(data),
          nextCursor,
          prevCursor,
        }));
    };
  };
}
