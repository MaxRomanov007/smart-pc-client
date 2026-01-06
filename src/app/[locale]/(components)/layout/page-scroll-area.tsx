import { ScrollArea } from "@chakra-ui/react";
import type { ComponentProps, ReactNode } from "react";

interface Props extends ComponentProps<typeof ScrollArea.Root> {
  children?: ReactNode;
}

export default function PageScrollArea({ children, ...props }: Props) {
  return (
    <ScrollArea.Root {...props}>
      <ScrollArea.Viewport>
        <ScrollArea.Content p={2}>{children}</ScrollArea.Content>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar orientation="horizontal" />
      <ScrollArea.Scrollbar orientation="vertical" />
      <ScrollArea.Corner />
    </ScrollArea.Root>
  );
}
