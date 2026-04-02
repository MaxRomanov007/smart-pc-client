"use client";

import { useAgentStatus } from "@/utils/hooks/agent";
import type { ComponentProps } from "react";
import AgentCommands from "@/app/[locale]/this-pc/(components)/agent-commands";

type Props = ComponentProps<typeof AgentCommands>;

export function AgentOnlineOnlyView({ ...props }: Props) {
  const state = useAgentStatus("http://localhost:8506");

  if (state !== "online") {
    return;
  }

  return <AgentCommands {...props} />;
}
