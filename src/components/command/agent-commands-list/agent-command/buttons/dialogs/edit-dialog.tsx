import { useExtracted } from "next-intl";
import { Button, CloseButton, Dialog, Portal } from "@chakra-ui/react";
import { Tooltip } from "@/components/ui/chakra/tooltip";
import { type ComponentProps, useState } from "react";
import type { IAgentCommand } from "@/types/agent";
import { useEditCommandMutation } from "@/utils/hooks/queries/agent/mutations/use-edit-command-mutation";
import type { AgentCommandToEdit } from "@/services/agent";
import EditCommandForm from "@/components/command/agent-commands-list/agent-command/buttons/dialogs/edit-command-form";

interface Props extends ComponentProps<typeof Dialog.Root> {
  command: IAgentCommand;
  tooltip?: string;
}

export function EditDialog({ command, tooltip, children, ...props }: Props) {
  const t = useExtracted("agent-command-edit-dialog");
  const { mutate } = useEditCommandMutation(command.id);
  const [commandToEdit, setCommandToEdit] =
    useState<AgentCommandToEdit>(command);

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
                  message: "Here you can edit command {name}",
                  values: {
                    name: command.name,
                  },
                  description: "header",
                })}
              </Dialog.Title>
            </Dialog.Header>

            <Dialog.Body>
              <EditCommandForm
                command={commandToEdit}
                onCommandUpdate={setCommandToEdit}
              />
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
                <Button onClick={() => mutate(commandToEdit)}>
                  {t({
                    message: "Edit",
                    description: "edit button text",
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
