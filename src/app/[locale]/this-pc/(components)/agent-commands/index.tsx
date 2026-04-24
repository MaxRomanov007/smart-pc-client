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

type Props = ComponentProps<typeof AgentCommandsGrid>;

export default function AgentCommands({ ...props }: Props) {
  const { data, isError } = useAgentCommands();
  const { mutate } = useCreateCommandMutation();

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
          onEdit={mutate}
        >
          <AddButton />
        </EditDialog>
      </Float>
    </AgentCommandsGrid>
  );
}
