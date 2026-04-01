import { For } from "@chakra-ui/react";
import { AgentCommandsListEmptyState } from "@/components/command/agent-commands-list/agent-commands-list-empty-state";
import { AgentCommand } from "@/components/command/agent-commands-list/agent-command";
import type { IAgentCommand } from "@/types/agent";

interface Props {
  commands: IAgentCommand[];
}

export function AgentCommandsList({ commands }: Props) {
  return (
    <For each={commands} fallback={<AgentCommandsListEmptyState />}>
      {(command) => <AgentCommand key={command.id} command={command} />}
    </For>
  );
}
