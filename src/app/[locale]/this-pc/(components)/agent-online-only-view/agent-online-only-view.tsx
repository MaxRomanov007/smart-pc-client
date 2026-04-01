import { useAgentStatus } from "@/utils/hooks/agent";
import PcAgentCommandsCard from "@/app/[locale]/this-pc/(components)/pc-commands-card/pc-agent-commands-card";

export function AgentOnlineOnlyView() {
  const state = useAgentStatus("http://localhost:8506");

  if (state !== "online") {
    return;
  }

  return <PcAgentCommandsCard />;
}
