import type { ICommand } from "@/types/pc/command";
import { Card, Flex, Spacer, Text } from "@chakra-ui/react";
import CommandIconButton from "@/components/button/command/command-icon-button";
import { LuPlay } from "react-icons/lu";
import type { IPc } from "@/types/pc/pc";

interface Props {
  command: ICommand;
  pc: IPc;
}

export default function Command({ command, pc }: Props) {
  return (
    <Card.Root variant="elevated" mb={4}>
      <Card.Body>
        <Flex alignItems="center">
          <Text>{command.name}</Text>
          <Spacer />
          <CommandIconButton
            opts={{ pc, commandId: command.id, shouldRequest: true }}
            variant={"subtle"}
            size="sm"
          >
            <LuPlay />
          </CommandIconButton>
        </Flex>
      </Card.Body>
    </Card.Root>
  );
}
