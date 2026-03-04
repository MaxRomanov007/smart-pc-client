import { useMqttPublish } from "@/lib/mqtt/hooks/use-mqtt-publish";
import { useCallback } from "react";
import type { MQTTMessage } from "@/lib/mqtt/types";

export function useMqttJsonPublish() {
  const { publish, ...rest } = useMqttPublish();

  const jsonPublish = useCallback(
    async (message: MQTTMessage<unknown>) => {
      const jsonMessage: MQTTMessage<string> = {
        ...message,
        payload: JSON.stringify(message.payload, (_, value) => {
          if (value instanceof Map) {
            return Object.fromEntries(value);
          }
          return value;
        }),
      };

      await publish(jsonMessage);
    },
    [publish],
  );

  return { publish: jsonPublish, ...rest };
}
