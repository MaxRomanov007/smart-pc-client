"use client";

import { useExtracted } from "next-intl";
import { LuSquarePen } from "react-icons/lu";
import { Button, IconButton } from "@chakra-ui/react";
import { EditDialog } from "./dialogs";
import type { ComponentProps } from "react";

interface Props extends Omit<
  ComponentProps<typeof EditDialog>,
  "children" | "tooltip"
> {
  buttonProps?: ComponentProps<typeof IconButton>;
}

export function EditDialogButton({ buttonProps, ...props }: Props) {
  const t = useExtracted("agent-command-edit-button");

  return (
    <EditDialog {...props}>
      <Button {...buttonProps}>
        <LuSquarePen />

        {t("Edit")}
      </Button>
    </EditDialog>
  );
}
