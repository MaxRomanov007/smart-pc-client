import { useQuery } from "@tanstack/react-query";
import { agentQueryKeys } from "@/utils/hooks/queries/agent";
import { agentApi } from "@/services/agent";

export function useAgentInfo(port?: number) {
  return useQuery({
    queryKey: agentQueryKeys.info,
    queryFn: agentApi.fetchInfo(port),
  });
}
