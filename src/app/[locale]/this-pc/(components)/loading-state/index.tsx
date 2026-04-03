import AgentCommandsGrid from "@/app/[locale]/this-pc/(components)/agent-commands-grid";
import type { ComponentProps } from "react";
import { Skeleton } from "@chakra-ui/react";
import AgentCommand from "@/components/command/agent-commands-list/agent-command";
import type { IAgentCommand } from "@/types/agent";

export default function LoadingState({
  ...props
}: ComponentProps<typeof AgentCommandsGrid>) {
  return (
    <AgentCommandsGrid {...props}>
      <Skeleton>
        <AgentCommand command={{} as IAgentCommand} />
      </Skeleton>
      <Skeleton>
        <AgentCommand command={{} as IAgentCommand} />
      </Skeleton>
      <Skeleton>
        <AgentCommand command={{} as IAgentCommand} />
      </Skeleton>
    </AgentCommandsGrid>
  );
}
