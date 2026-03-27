import { type InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import { pcLogsQueryKeys } from "@/utils/hooks/queries/pcs/logs";
import { type Order, pcsApi } from "@/services/pcs";
import { type IPcLog, PcLogStatus } from "@/types/pc/pc-log";
import type { PaginatedResult } from "@/lib/axios/handle-api-paginated-response";

export interface UsePcLogsInfiniteQueryOptions {
  pcId: string;
  limit?: number;
  order?: Order;
}

const placeholderLog: IPcLog = {
  id: "",
  receivedAt: new Date(),
  completedAt: new Date(),
  status: PcLogStatus.ok,
  commandId: "",
} as const;

const PLACEHOLDERS_COUNT = 20;
const placeholderLogs = new Array<IPcLog>(PLACEHOLDERS_COUNT).fill(
  placeholderLog,
);

const placeholderData: InfiniteData<
  PaginatedResult<IPcLog[]>,
  string | undefined
> = {
  pages: [
    {
      data: placeholderLogs,
      nextCursor: "",
      prevCursor: "",
    },
  ],
  pageParams: [undefined],
} as const;

export function usePcLogsInfiniteQuery(opts: UsePcLogsInfiniteQueryOptions) {
  return useInfiniteQuery({
    queryKey: pcLogsQueryKeys.pcLogs(opts.pcId),
    queryFn: pcsApi.fetchPcLogs(opts.pcId, opts.limit, opts.order),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    getPreviousPageParam: (firstPage) => firstPage.prevCursor,
    placeholderData,
  });
}
