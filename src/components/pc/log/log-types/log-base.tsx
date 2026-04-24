import { Badge, HStack, Text } from "@chakra-ui/react";
import type { IPcLog } from "@/types/pc/pc-log";
import type { ComponentProps } from "react";
import { validate } from "uuid";

interface Props extends ComponentProps<typeof HStack> {
  log: IPcLog;
  badge?: string;
}

export default function LogBase({ log, badge, colorPalette, ...props }: Props) {
  return (
    <HStack {...props}>
      <Badge colorPalette={colorPalette}>{badge}</Badge>
      <Text truncate>
        {!!log.command?.name
          ? log.command.name
          : validate(log.commandId)
            ? "id:" + log.commandId
            : log.commandId}
      </Text>
    </HStack>
  );
}
