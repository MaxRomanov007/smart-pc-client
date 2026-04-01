import { useQuery } from "@tanstack/react-query";
import { agentQueryKeys } from "@/utils/hooks/queries/agent";
import { agentApi } from "@/services/agent";

export function useAgentCommands(port?: number) {
  return useQuery({
    queryKey: agentQueryKeys.commands,
    queryFn: agentApi.fetchCommands(port),
  });
}
