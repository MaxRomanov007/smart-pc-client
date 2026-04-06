"use client";

import { useExtracted } from "next-intl";
import { DeleteDialog } from "@/components/command/agent-commands-list/agent-command/buttons/dialogs";
import type { ComponentProps } from "react";
import DeleteButton from "@/components/button/delete-button";

interface Props extends Omit<
  ComponentProps<typeof DeleteDialog>,
  "children" | "tooltip"
> {
  buttonProps?: ComponentProps<typeof DeleteButton>;
}

export function DeleteDialogButton({ buttonProps, ...props }: Props) {
  const t = useExtracted("agent-command-delete-button");

  return (
    <DeleteDialog
      tooltip={t({
        message: "Delete",
        description: "tooltip text",
      })}
      {...props}
    >
      <DeleteButton {...buttonProps} />
    </DeleteDialog>
  );
}
