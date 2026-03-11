export enum StatusCodes {
  ok = "ok",
  notFound = "not-found",
}

export interface Response<T> {
  status?: StatusCodes;
  data?: T;
  error?: Error | string;
}
