import type { ErrorResponse } from "@/types/api/response";

export interface ApiErrorConstructor {
  title?: string;
  message?: string;
  block?: boolean;
  response?: ErrorResponse;
}

export class ApiError extends Error {
  title: string;
  block: boolean;
  response?: ErrorResponse;

  constructor(opts?: ApiErrorConstructor) {
    super(opts?.message);
    this.name = "ApiError";
    this.title = opts?.title ?? "ApiError";
    this.block = opts?.block ?? false;
    this.response = opts?.response;
  }
}
