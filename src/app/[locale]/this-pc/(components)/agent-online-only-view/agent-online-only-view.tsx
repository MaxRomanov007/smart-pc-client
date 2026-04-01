import { useAgentStatus } from "@/utils/hooks/agent";

export function AgentOnlineOnlyView() {
  const state = useAgentStatus("http://localhost:8506");

  if (state !== "online") {
    return;
  }

  return <div>Heloo</div>;
}
