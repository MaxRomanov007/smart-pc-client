import { useInfiniteQuery } from "@tanstack/react-query";
import { pcLogsQueryKeys } from "@/utils/hooks/queries/pcs/logs";
import { type Order, pcsApi } from "@/services/pcs";

export interface UsePcLogsInfiniteQueryOptions {
  pcId: string;
  limit?: number;
  order?: Order;
}

export function usePcLogsInfiniteQuery(opts: UsePcLogsInfiniteQueryOptions) {
  return useInfiniteQuery({
    queryKey: pcLogsQueryKeys.pcLogs(opts.pcId),
    queryFn: pcsApi.fetchPcLogs(opts.pcId, opts.limit, opts.order),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    getPreviousPageParam: (firstPage) => firstPage.prevCursor,
  });
}
