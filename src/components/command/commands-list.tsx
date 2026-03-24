import type { ICommand } from "@/types/pc/command";
import { For } from "@chakra-ui/react";
import Command from "@/components/command/command";

interface Props {
  commands: ICommand[];
}

export default function CommandsList({ commands }: Props) {
  return (
    <For each={commands}>{(command) => <Command command={command} />}</For>
  );
}
