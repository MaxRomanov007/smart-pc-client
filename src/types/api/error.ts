import { type ErrorResponse, StatusCodes } from "@/types/api/response";
import { handleError, showError } from "@/utils/errors";
import { notFound } from "next/navigation";
import { enumValueToKey } from "@/utils/enums/enum-value-to-key";

type ErrorHandler = (error: ApiError) => void;
type Handlers = Readonly<
  Partial<Record<keyof typeof StatusCodes, ErrorHandler>>
>;

const handlers: Handlers = {
  notFound: () => notFound(),
} as const;

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
    this.title = opts?.title ?? "";
    this.block = opts?.block ?? false;
    this.response = opts?.response;
  }

  handle(): void {
    if (!this.block) {
      this.show();
      return;
    }

    if (!this.response?.status) {
      handleError(this.title, this.message);
    }

    const key =
      this.response?.status &&
      enumValueToKey(StatusCodes, this.response.status);
    const handler = key && handlers[key];

    if (!handler) {
      handleError(this.title, this.message);
    }

    this.show();
    handler(this);
  }

  show(): void {
    if (!this.title && !this.message) {
      return;
    }

    showError(this.title, this.message);
  }
}
