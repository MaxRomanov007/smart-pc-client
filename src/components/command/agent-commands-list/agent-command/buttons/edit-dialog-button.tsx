"use client";

import { useExtracted } from "next-intl";
import { LuSquarePen } from "react-icons/lu";
import { Button, IconButton } from "@chakra-ui/react";
import { EditDialog } from "./dialogs";
import type { ComponentProps } from "react";
import { useEditCommandMutation } from "@/utils/hooks/queries/agent";

interface Props extends Omit<
  ComponentProps<typeof EditDialog>,
  "children" | "tooltip"
> {
  buttonProps?: ComponentProps<typeof IconButton>;
}

export function EditDialogButton({ buttonProps, command, ...props }: Props) {
  const t = useExtracted("agent-command-edit-button");
  const { mutate } = useEditCommandMutation(command.id);

  return (
    <EditDialog command={command} onEdit={mutate} {...props}>
      <Button {...buttonProps}>
        <LuSquarePen />

        {t("Edit")}
      </Button>
    </EditDialog>
  );
}
