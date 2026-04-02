import { useMutation, useQueryClient } from "@tanstack/react-query";
import { agentMutationKeys, agentQueryKeys } from "@/utils/hooks/queries/agent";
import { agentApi } from "@/services/agent";
import type { IAgentCommand } from "@/types/agent";

export function useDeleteCommandMutation(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: agentMutationKeys.deleteCommand(id),
    mutationFn: agentApi.deleteCommand(),
    onMutate: async (commandId) => {
      await queryClient.cancelQueries({
        queryKey: agentQueryKeys.commands,
      });
      const previousCommands = queryClient.getQueryData<IAgentCommand[]>(
        agentQueryKeys.commands,
      );

      queryClient.setQueryData(
        agentQueryKeys.commands,
        (oldData: IAgentCommand[]): IAgentCommand[] =>
          oldData.filter((c) => c.id !== commandId),
      );

      return { previousCommands };
    },
    onError: (_0, _1, context) => {
      if (!context) {
        return;
      }

      queryClient.setQueryData(
        agentQueryKeys.commands,
        context.previousCommands,
      );
    },
  });
}
