import type { AxiosResponse } from "axios";
import {
  type ApiResponse,
  isApiResponse,
  isSuccessResponse,
} from "@/types/api/response";
import {
  handleApiResponse,
  type HandleApiResponseOptions,
} from "@/lib/axios/handle-api-response";

export interface PaginatedResult<T> {
  data: T;
  nextCursor: string | undefined;
  prevCursor: string | undefined;
}

type HandleApiPaginatedResponseResult<T, D, H> = (
  response: AxiosResponse<ApiResponse<T> | T, D, H>,
) => PaginatedResult<T> | Promise<PaginatedResult<T>>;

export function handleApiPaginatedResponse<T, D, H>(
  opts?: HandleApiResponseOptions,
): HandleApiPaginatedResponseResult<T, D, H> {
  return (response) => {
    if (!isApiResponse<T>(response.data)) {
      return {
        data: response.data as T,
        nextCursor: undefined,
        prevCursor: undefined,
      };
    }

    const apiResponse = response.data;

    if (isSuccessResponse<T>(apiResponse)) {
      return {
        data: apiResponse.data,
        nextCursor: apiResponse.pagination?.nextCursor,
        prevCursor: apiResponse.pagination?.prevCursor,
      };
    }

    return handleApiResponse<T, D, H>(opts)(response) as never;
  };
}
