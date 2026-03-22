import type { ApiError } from "@/types/api/error";
import { handleError, showError } from "@/utils/errors";
import { StatusCodes } from "@/types/api/response";
import { notFound } from "next/navigation";

export function handleApiError(error: ApiError): void {
  if (!error.block) {
    showError(error.title, error.message);
    return;
  }

  switch (error.response?.status) {
    case StatusCodes.notFound:
      showError(error.title, error.message);
      return notFound();
    default:
      return handleError(error.title, error.message);
  }
}
