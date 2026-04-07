import { useMutation, useQueryClient } from "@tanstack/react-query";
import { agentMutationKeys, agentQueryKeys } from "@/utils/hooks/queries/agent";
import { agentApi } from "@/services/agent";
import type { IAgentCommand } from "@/types/agent";

export function useCreateCommandMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: agentMutationKeys.createCommand(),
    mutationFn: agentApi.createCommand(),
    onMutate: async (data) => {
      await queryClient.cancelQueries({
        queryKey: agentQueryKeys.commands,
      });

      const previousCommands = queryClient.getQueryData<IAgentCommand[]>(
        agentQueryKeys.commands,
      );

      const optimisticCommand: IAgentCommand = {
        id: crypto.randomUUID(),
        name: data.name ?? "",
        description: data.description ?? "",
        script: data.script ?? "",
        parameters: data.parameters ?? [],
      };

      queryClient.setQueryData(
        agentQueryKeys.commands,
        (oldData: IAgentCommand[]): IAgentCommand[] => [
          ...oldData,
          optimisticCommand,
        ],
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
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: agentQueryKeys.commands,
      });
    },
  });
}
