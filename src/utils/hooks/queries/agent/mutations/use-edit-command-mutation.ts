import { useMutation, useQueryClient } from "@tanstack/react-query";
import { agentMutationKeys, agentQueryKeys } from "@/utils/hooks/queries/agent";
import { agentApi } from "@/services/agent";
import type { IAgentCommand } from "@/types/agent";
import { usePcId } from "@/utils/hooks/queries/agent/queries/use-pc-id";
import { pcCommandsQueryKeys } from "@/utils/hooks/queries/pcs/commands";

export function useEditCommandMutation(id: string) {
  const queryClient = useQueryClient();
  const { data: pcId } = usePcId();

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
                  parameters: data.parameters ?? command.parameters,
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
    onSuccess: () => {
      if (pcId) {
        queryClient.invalidateQueries({
          queryKey: pcCommandsQueryKeys.pcCommands(pcId),
        });
      }
    },
  });
}
