export enum StatusCodes {
  ok = "ok",
  notFound = "not-found",
}

interface Pagination {
  total: number;
  hasPrev: boolean;
  hasNext: boolean;
  prevCursor?: string;
  nextCursor?: string;
}

interface Response<S extends StatusCodes, D, E> {
  status: S;
  data: D;
  error: E;
}

export type SuccessResponse<T> = Response<StatusCodes.ok, T, never> & {
  pagination?: Pagination;
};
export type ErrorResponse = Response<
  Exclude<StatusCodes, StatusCodes.ok>,
  never,
  string
>;

export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

export function isApiResponse<T>(obj: unknown): obj is ApiResponse<T> {
  if (typeof obj !== "object" || obj === null) return false;

  return "status" in obj;
}

export function isSuccessResponse<T>(
  response: ApiResponse<T>,
): response is SuccessResponse<T> {
  return response.status === StatusCodes.ok;
}
