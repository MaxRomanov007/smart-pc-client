import { useEffect, useReducer } from "react";

type AgentStatus = "online" | "offline" | "connecting";

type State = {
  status: AgentStatus;
  retryKey: number;
};

type Action = { type: "online" } | { type: "offline" } | { type: "retry" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "online":
      return { ...state, status: "online" };
    case "offline":
      return { ...state, status: "offline" };
    case "retry":
      return { status: "connecting", retryKey: state.retryKey + 1 };
  }
}

export function useAgentStatus(agentUrl: string) {
  const [{ status, retryKey }, dispatch] = useReducer(reducer, {
    status: "connecting",
    retryKey: 0,
  });

  useEffect(() => {
    const TIMEOUT_MS = 15_000;
    let offlineTimer: ReturnType<typeof setTimeout>;

    const resetTimer = () => {
      clearTimeout(offlineTimer);
      offlineTimer = setTimeout(
        () => dispatch({ type: "offline" }),
        TIMEOUT_MS,
      );
    };

    const es = new EventSource(`${agentUrl}/health/stream`);

    es.addEventListener("ping", () => {
      dispatch({ type: "online" });
      resetTimer();
    });

    es.onerror = () => dispatch({ type: "offline" });

    resetTimer();

    return () => {
      clearTimeout(offlineTimer);
      es.close();
    };
  }, [agentUrl, retryKey]);

  return { status, retry: () => dispatch({ type: "retry" }) };
}
