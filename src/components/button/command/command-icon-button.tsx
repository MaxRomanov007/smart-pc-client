"use client";

import {
  type ComponentProps,
  type MouseEventHandler,
  type ReactNode,
  useCallback,
} from "react";
import { IconButton } from "@chakra-ui/react";
import { useCommands } from "@/utils/hooks/commands/hook";
import type { DoCommandOptions } from "@/utils/hooks/commands/types";

interface Props extends ComponentProps<typeof IconButton> {
  children?: ReactNode;
  opts: DoCommandOptions;
}

export default function CommandIconButton({
  opts,
  children,
  onClick,
  ...props
}: Props) {
  const { doCommand } = useCommands();
  const handleClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    (e) => {
      doCommand(opts);
      onClick?.(e);
    },
    [doCommand, onClick, opts],
  );

  return (
    <IconButton onClick={handleClick} {...props}>
      {children}
    </IconButton>
  );
}
