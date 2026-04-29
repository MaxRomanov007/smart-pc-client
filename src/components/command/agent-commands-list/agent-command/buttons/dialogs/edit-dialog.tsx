import { useExtracted } from "next-intl";
import { Button, CloseButton, Dialog, Portal } from "@chakra-ui/react";
import { Tooltip } from "@/components/ui/chakra/tooltip";
import { type ComponentProps, useMemo, useState } from "react";
import type { IAgentCommand } from "@/types/agent";
import type { AgentCommandToEdit } from "@/services/agent";
import EditCommandForm from "@/components/command/agent-commands-list/agent-command/buttons/dialogs/edit-command-form";

interface Props extends ComponentProps<typeof Dialog.Root> {
  command: IAgentCommand;
  tooltip?: string;
  onEdit?: (command: AgentCommandToEdit) => void;
  create?: boolean;
}

export function EditDialog({
  command,
  tooltip,
  children,
  onEdit,
  create,
  ...props
}: Props) {
  const t = useExtracted("agent-command-edit-dialog");
  const [commandToEdit, setCommandToEdit] =
    useState<AgentCommandToEdit>(command);

  const canEdit = useMemo<boolean>(() => {
    if (!commandToEdit.parameters) {
      return true;
    }

    return !commandToEdit.parameters.some((parameter) =>
      commandToEdit.parameters?.some(
        (param) => param.name === parameter.name && param.id !== parameter.id,
      ),
    );
  }, [commandToEdit.parameters]);

  return (
    <Dialog.Root
      closeOnEscape={false}
      size={{ mdDown: "full", md: "lg" }}
      {...props}
    >
      <Tooltip content={tooltip}>
        <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      </Tooltip>

      <Portal>
        <Dialog.Backdrop />

        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title truncate>
                {create
                  ? t({
                      message: "Create new command",
                      description: "title on create dialog",
                    })
                  : t({
                      message: 'Edit command "{name}"',
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
                <Button
                  onClick={() => onEdit?.(commandToEdit)}
                  disabled={!canEdit}
                >
                  {create
                    ? t({
                        message: "Create",
                        description: "create button text",
                      })
                    : t({
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
