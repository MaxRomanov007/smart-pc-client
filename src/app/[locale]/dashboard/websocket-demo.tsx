"use client";

import useWebSocket, { ReadyState } from "react-use-websocket";
import { useToken } from "@/utils/auth/client";
import { VStack } from "@chakra-ui/react";

export const WebSocketDemo = () => {
  const { token, loading, error } = useToken();

  console.log("client token", token, loading, error);

  console.log("url", getWebSocketUrl(token ?? ""));

  const { lastMessage, readyState } = useWebSocket(
    getWebSocketUrl(token ?? ""),
    {
      shouldReconnect: () => error === null
    },
  );

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  return (
    <VStack>
      <span>The WebSocket is currently {connectionStatus}</span>
      {lastMessage ? <span>Last message: {lastMessage.data}</span> : null}
    </VStack>
  );
};

function getWebSocketUrl(token: string) {
  const url = new URL("ws://localhost:9080/mqtt/pc");
  url.searchParams.append("token", token);
  return url.toString();
}
