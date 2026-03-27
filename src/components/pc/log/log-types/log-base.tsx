import { Badge, HStack, Text } from "@chakra-ui/react";
import type { IPcLog } from "@/types/pc/pc-log";
import type { ComponentProps } from "react";

interface Props extends ComponentProps<typeof HStack> {
  log: IPcLog;
  badge?: string;
}

export default function LogBase({ log, badge, ...props }: Props) {
  return (
    <HStack {...props}>
      <Badge colorPalette={props.colorPalette}>{badge}</Badge>
      <Text truncate>{log.commandName ?? "id:" + log.commandId}</Text>
    </HStack>
  );
}
