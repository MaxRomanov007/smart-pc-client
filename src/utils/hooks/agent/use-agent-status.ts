import { useEffect, useState } from "react";

type AgentStatus = "online" | "offline" | "connecting";

export function useAgentStatus(agentUrl: string) {
  const [status, setStatus] = useState<AgentStatus>("connecting");

  useEffect(() => {
    let es: EventSource;
    let offlineTimer: ReturnType<typeof setTimeout>;

    const TIMEOUT_MS = 15_000;

    const resetTimer = () => {
      clearTimeout(offlineTimer);
      offlineTimer = setTimeout(() => setStatus("offline"), TIMEOUT_MS);
    };

    const connect = () => {
      es = new EventSource(`${agentUrl}/health/stream`);

      es.addEventListener("ping", () => {
        setStatus("online");
        resetTimer();
      });

      es.onerror = () => {
        setStatus("offline");
      };
    };

    connect();
    resetTimer();

    return () => {
      clearTimeout(offlineTimer);
      es.close();
    };
  }, [agentUrl]);

  return status;
}
