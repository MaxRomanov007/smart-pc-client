import type { IClientSubscribeOptions } from "mqtt";
import type { MQTTMessage } from "@/lib/mqtt/types";
import { useCallback } from "react";
import { useMqttSubscribe } from "@/lib/mqtt/hooks/use-mqtt-subscribe";

export interface UseMqttJsonSubscribeOptions<
  T,
> extends IClientSubscribeOptions {
  onMessage: (message: MQTTMessage<T>) => void;
  persistent?: boolean;
}

export function useMqttJsonSubscribe<T>(
  topic: string | string[],
  { onMessage, ...rest }: UseMqttJsonSubscribeOptions<T>,
) {
  const onMqttMessage = useCallback(
    (message: MQTTMessage) => {
      const { topic, payload } = message;
      const typedPayload: T = JSON.parse(payload.toString());

      onMessage({ topic, payload: typedPayload });
    },
    [onMessage],
  );

  return useMqttSubscribe(topic, { ...rest, onMessage: onMqttMessage });
}
