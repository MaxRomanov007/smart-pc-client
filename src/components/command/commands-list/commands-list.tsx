import type { ICommand } from "@/types/pc/command";
import { For } from "@chakra-ui/react";
import { Command } from "@/components/command/commands-list/command";
import type { IPc } from "@/types/pc/pc";
import { CommandsListEmptyState } from "@/components/command/commands-list/commands-list-empty-state";

interface Props {
  commands: ICommand[];
  pc: IPc;
}

export function CommandsList({ commands, pc }: Props) {
  return (
    <For each={commands} fallback={<CommandsListEmptyState />}>
      {(command) => <Command key={command.id} pc={pc} command={command} />}
    </For>
  );
}
