import type { ApiResponse } from "@/types/api/response";
import type { AxiosResponse } from "axios";
import { handleApiResponse, type HandleApiResponseOptions } from "@/lib/axios/handle-api-response";

export function withHandleApiResponse<A extends unknown[], T>(
  fn: (...args: A) => Promise<AxiosResponse<ApiResponse<T> | T>>,
) {
  return (...args: [...A, HandleApiResponseOptions?]): Promise<T> => {
    const opts = args[args.length - 1] as HandleApiResponseOptions | undefined;
    const fnArgs = args.slice(0, -1) as unknown as A;
    return fn(...fnArgs).then(handleApiResponse(opts));
  };
}
