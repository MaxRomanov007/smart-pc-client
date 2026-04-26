import { AgentCommandsList } from "@/components/command/agent-commands-list";
import {
  useAgentCommands,
  useCreateCommandMutation,
} from "@/utils/hooks/queries/agent";
import { type ComponentProps } from "react";
import AgentCommandsGrid from "@/app/[locale]/this-pc/(components)/agent-commands-grid";
import { Float } from "@chakra-ui/react";
import AddButton from "@/components/button/add-button";
import { EditDialog } from "@/components/command/agent-commands-list/agent-command/buttons/dialogs";
import ConfirmationDialog from "@/components/ui/dialog/confirmation-dialog/dialog";
import { useExtracted } from "next-intl";
import DeleteButton from "@/components/button/delete-button";
import { useDeleteThisPcMutation } from "@/utils/hooks/queries/agent/mutations/use-delete-this-pc-mutation";

type Props = ComponentProps<typeof AgentCommandsGrid>;

export function AgentCommands({ ...props }: Props) {
  const { data, isError } = useAgentCommands();
  const { mutate: createCommand } = useCreateCommandMutation();
  const { mutate: deleteThisPc } = useDeleteThisPcMutation();
  const t = useExtracted("agent-commands");

  if (isError || !data) return null;

  return (
    <AgentCommandsGrid {...props}>
      <AgentCommandsList commands={data} />

      <Float placement="bottom-end" offset={8}>
        <EditDialog
          create
          command={{
            id: "",
            description: "",
            parameters: [],
            script: "",
            name: "",
          }}
          onEdit={createCommand}
        >
          <AddButton />
        </EditDialog>
      </Float>

      <Float placement="top-end" offset={8}>
        <ConfirmationDialog
          title={t({
            message: "Are you sure you want to delete this PC?",
            description: "delete this pc confirmation dialog title",
          })}
          content={t({
            message: "All data and commands will be lost forever.",
            description: "delete this pc confirmation dialog description",
          })}
          tooltip={t({
            message: "Delete this PC",
            description: "delete this pc button text",
          })}
          confirmButtonProps={{ colorPalette: "red", variant: "outline" }}
          cancelButtonProps={{ variant: "solid" }}
          onConfirm={() => deleteThisPc()}
        >
          <DeleteButton variant="ghost" />
        </ConfirmationDialog>
      </Float>
    </AgentCommandsGrid>
  );
}
