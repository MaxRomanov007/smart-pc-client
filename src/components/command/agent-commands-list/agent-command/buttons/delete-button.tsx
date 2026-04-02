"use client";

import { LuTrash2 } from "react-icons/lu";
import { IconButton } from "@chakra-ui/react";
import { useExtracted } from "next-intl";
import { DeleteDialog } from "@/components/command/agent-commands-list/agent-command/buttons/dialogs";
import type { ComponentProps } from "react";

interface Props extends Omit<
  ComponentProps<typeof DeleteDialog>,
  "children" | "tooltip"
> {
  buttonProps?: ComponentProps<typeof IconButton>;
}

export function DeleteButton({ buttonProps, ...props }: Props) {
  const t = useExtracted("agent-command-delete-button");

  return (
    <DeleteDialog
      tooltip={t({
        message: "Delete",
        description: "tooltip text",
      })}
      {...props}
    >
      <IconButton variant="ghost" colorPalette="red" {...buttonProps}>
        <LuTrash2 />
      </IconButton>
    </DeleteDialog>
  );
}
