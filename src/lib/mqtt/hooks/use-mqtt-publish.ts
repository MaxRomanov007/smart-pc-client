import { useMqtt } from "@/lib/mqtt/provider";
import { useCallback } from "react";
import type { MQTTMessage } from "@/lib/mqtt/types";

export function useMqttPublish() {
  const { publish, status } = useMqtt();

  const publishMessage = useCallback(
    async (message: MQTTMessage) => {
      if (status !== "connected") {
        throw new Error(`Cannot publish: MQTT status is "${status}"`);
      }
      return publish(message);
    },
    [publish, status],
  );

  return {
    publish: publishMessage,
    isConnected: status === "connected",
  };
}
