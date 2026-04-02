import { useMutation, useQueryClient } from "@tanstack/react-query";
import { agentMutationKeys, agentQueryKeys } from "@/utils/hooks/queries/agent";
import { agentApi } from "@/services/agent";
import type { IAgentCommand } from "@/types/agent";

export function useEditCommandMutation(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: agentMutationKeys.editCommand(id),
    mutationFn: agentApi.editCommand(),
    onMutate: async (data) => {
      await queryClient.cancelQueries({
        queryKey: agentQueryKeys.commands,
      });

      const previousCommands = queryClient.getQueryData<IAgentCommand[]>(
        agentQueryKeys.commands,
      );

      queryClient.setQueryData(
        agentQueryKeys.commands,
        (oldData: IAgentCommand[]): IAgentCommand[] =>
          oldData.map((command) =>
            command.id === data.id
              ? {
                  id: command.id,
                  name: data.name ?? command.name,
                  description: data.description ?? command.description,
                  script: data.script ?? command.script,
                }
              : command,
          ),
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
