export enum StatusCodes {
  ok = 0,
  notFound = 1,
}

export interface Response<T> {
  status?: StatusCodes;
  data?: T;
  error?: Error | string;
}
