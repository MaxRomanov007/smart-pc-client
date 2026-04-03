"use client";

import type { ComponentProps } from "react";
import { Button, CloseButton, Dialog, Portal } from "@chakra-ui/react";
import type { IAgentCommand } from "@/types/agent";
import { useExtracted } from "next-intl";
import { Tooltip } from "@/components/ui/chakra/tooltip";
import { useDeleteCommandMutation } from "@/utils/hooks/queries/agent";

interface Props extends ComponentProps<typeof Dialog.Root> {
  command: IAgentCommand;
  tooltip?: string;
}

export function DeleteDialog({ command, tooltip, children, ...props }: Props) {
  const t = useExtracted("agent-command-delete-dialog");
  const { mutate } = useDeleteCommandMutation(command.id);

  return (
    <Dialog.Root size={{ mdDown: "full", md: "lg" }} {...props}>
      <Tooltip content={tooltip}>
        <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      </Tooltip>

      <Portal>
        <Dialog.Backdrop />

        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title truncate>
                {t({
                  message:
                    'Are you sure you want to delete the command "{name}"?',
                  values: {
                    name: command.name,
                  },
                  description: "header",
                })}
              </Dialog.Title>
            </Dialog.Header>

            <Dialog.Body>
              <p>
                {t({
                  message:
                    "This action cannot be undone. The command will be permanently deleted",
                  description: "description",
                })}
              </p>
            </Dialog.Body>

            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">
                  {t({
                    message: "Cancel",
                    description: "cancel button text",
                  })}
                </Button>
              </Dialog.ActionTrigger>

              <Dialog.ActionTrigger asChild>
                <Button colorPalette="red" onClick={() => mutate(command.id)}>
                  {t({
                    message: "Delete",
                    description: "delete button text",
                  })}
                </Button>
              </Dialog.ActionTrigger>
            </Dialog.Footer>

            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
