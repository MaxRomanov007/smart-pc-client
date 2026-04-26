import { useMutation, useQueryClient } from "@tanstack/react-query";
import { agentMutationKeys, agentQueryKeys } from "@/utils/hooks/queries/agent";
import { agentApi } from "@/services/agent";

export function useDeleteThisPcMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: agentMutationKeys.deleteThisPc(),
    mutationFn: agentApi.deleteThisPc(),
    onSuccess: () => {
      const removeKeys = [agentQueryKeys.commands, agentQueryKeys.pcId];

      for (const key of removeKeys) {
        queryClient.removeQueries({
          queryKey: key,
        });
      }

      queryClient
        .getQueryCache()
        .getAll()
        .forEach((cache) => cache.invalidate());
    },
  });
}
