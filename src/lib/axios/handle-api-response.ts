import type { AxiosResponse } from "axios";
import {
  type ApiResponse,
  isApiResponse,
  isSuccessResponse,
  StatusCodes,
} from "@/types/api/response";
import { ApiError } from "@/types/api/error";
import { enumValueToKey } from "@/utils/enums/enum-value-to-key";

type ErrorStatusKeys = Exclude<keyof typeof StatusCodes, StatusCodes.ok>;

interface ErrorOptions {
  title?: string;
  message?: string;
  block?: boolean;
}

type ErrorKeys = ErrorStatusKeys | "other";
type ErrorStatuses = Partial<Record<ErrorKeys, ErrorOptions>>;

export interface HandleApiResponseOptions {
  errors?: ErrorStatuses;
}

type HandleApiResponseResult<T, D, H> = (
  response: AxiosResponse<ApiResponse<T> | T, D, H>,
) => T | Promise<T>;

export function handleApiResponse<T, D, H>(
  opts?: HandleApiResponseOptions,
): HandleApiResponseResult<T, D, H> {
  return (response) => {
    if (!isApiResponse<T>(response.data)) {
      return response.data;
    }

    const apiResponse = response.data;

    if (isSuccessResponse<T>(apiResponse)) {
      return apiResponse.data;
    }

    const { ok: _, ...errorStatuses } = StatusCodes;
    const statusKey = enumValueToKey(errorStatuses, apiResponse.status);
    const errorOpts = statusKey
      ? opts?.errors?.[statusKey]
      : opts?.errors?.other;

    const err = new ApiError({
      title: errorOpts?.title,
      message: errorOpts?.message,
      block: errorOpts?.block,
      response: apiResponse,
    });

    err.handle();
    throw err;
  };
}
