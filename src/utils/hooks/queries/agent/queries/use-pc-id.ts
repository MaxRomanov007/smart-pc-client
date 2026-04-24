import { useQuery } from "@tanstack/react-query";
import { agentQueryKeys } from "@/utils/hooks/queries/agent";
import { agentApi } from "@/services/agent";

export function usePcId(port?: number) {
  return useQuery({
    queryKey: agentQueryKeys.pcId,
    queryFn: agentApi.fetchPcId(port),
  });
}
