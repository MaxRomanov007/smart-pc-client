import type { ICommand } from "@/types/pc/command";
import { For } from "@chakra-ui/react";
import Command from "@/components/command/command";
import type { IPc } from "@/types/pc/pc";
import CommandsListEmptyState from "@/components/command/commands-list-empty-state";

interface Props {
  commands: ICommand[];
  pc: IPc;
}

export default function CommandsList({ commands, pc }: Props) {
  return (
    <For each={commands} fallback={<CommandsListEmptyState />}>
      {(command) => <Command key={command.id} pc={pc} command={command} />}
    </For>
  );
}
