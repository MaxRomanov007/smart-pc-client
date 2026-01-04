"use client";

import { IconButton } from "@chakra-ui/react";
import { LuPanelLeftClose, LuPanelLeftOpen } from "react-icons/lu";
import { Tooltip } from "@/components/ui/chakra/tooltip";
import type { ComponentProps } from "react";

interface Props extends Omit<
  ComponentProps<typeof IconButton>,
  "children" | "onClick"
> {
  tooltip?: string;
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
}

export default function ChangeVisibilityButton({
  tooltip,
  isVisible,
  setIsVisible,
  variant,
  ...props
}: Props) {
  return (
    <Tooltip content={tooltip}>
      <IconButton
        variant={variant ?? "ghost"}
        onClick={() => setIsVisible(!isVisible)}
        {...props}
      >
        {isVisible ? <LuPanelLeftClose /> : <LuPanelLeftOpen />}
      </IconButton>
    </Tooltip>
  );
}
