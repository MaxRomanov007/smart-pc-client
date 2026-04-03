import { AgentCommandsList } from "@/components/command/agent-commands-list";
import { useAgentCommands } from "@/utils/hooks/queries/agent";
import type { ComponentProps } from "react";
import AgentCommandsGrid from "@/app/[locale]/this-pc/(components)/agent-commands-grid";

type Props = ComponentProps<typeof AgentCommandsGrid>;

export default function AgentCommands({ ...props }: Props) {
  const { data, isError } = useAgentCommands();

  if (isError || !data) return null;

  return (
    <AgentCommandsGrid {...props}>
      <AgentCommandsList commands={data} />
    </AgentCommandsGrid>
  );
}
