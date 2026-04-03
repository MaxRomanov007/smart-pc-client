"use client";

import { useAgentStatus } from "@/utils/hooks/agent";
import { type ComponentProps } from "react";
import AgentCommands from "../agent-commands";
import LoadingState from "../loading-state";
import OfflineState from "../offline-state";

type Props = ComponentProps<typeof AgentCommands>;

export function AgentOnlineOnlyView({ ...props }: Props) {
  const { status, retry } = useAgentStatus("http://localhost:8506");

  if (status === "connecting") {
    return <LoadingState />;
  }

  if (status === "offline") {
    return <OfflineState onRetry={retry} />;
  }

  return <AgentCommands {...props} />;
}
