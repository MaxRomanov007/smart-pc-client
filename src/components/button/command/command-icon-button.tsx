"use client";

import {
  type ComponentProps,
  type MouseEventHandler,
  type ReactNode,
  useCallback,
} from "react";
import type { IPc } from "@/types/pc/pc";
import { IconButton } from "@chakra-ui/react";
import { useCommands } from "@/utils/hooks/commands/hook";

interface Props extends ComponentProps<typeof IconButton> {
  children?: ReactNode;
  pc: IPc;
  commandName: string;
}

export default function CommandIconButton({
  commandName,
  pc,
  children,
  onClick,
  ...props
}: Props) {
  const { doCommand } = useCommands();
  const handleClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    (e) => {
      doCommand({
        pc,
        name: commandName,
        withoutDialog: true,
      });

      onClick?.(e);
    },
    [commandName, doCommand, onClick, pc],
  );

  return (
    <IconButton onClick={handleClick} {...props}>
      {children}
    </IconButton>
  );
}
