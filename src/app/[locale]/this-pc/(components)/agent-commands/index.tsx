import { AgentCommandsList } from "@/components/command/agent-commands-list";
import { Grid } from "@chakra-ui/react";
import { useAgentCommands } from "@/utils/hooks/queries/agent";
import type { ComponentProps } from "react";

type Props = ComponentProps<typeof Grid>;

export default function AgentCommands({ ...props }: Props) {
  const { data, isError } = useAgentCommands();

  if (isError || !data) return null;

  return (
    <Grid
      gap={4}
      templateColumns="repeat(auto-fit, minmax(360px, 1fr))"
      {...props}
    >
      <AgentCommandsList commands={data} />
    </Grid>
  );
}
