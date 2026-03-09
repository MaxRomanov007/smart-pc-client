import { useEffect, useRef } from "react";
import { type IClientSubscribeOptions } from "mqtt";
import { useMqtt } from "../provider";
import { TopicFactory } from "../utils/topic-factory";
import type { MQTTMessage } from "../types";

export interface UseMqttSubscribeOptions extends IClientSubscribeOptions {
  onMessage: (message: MQTTMessage) => void;
  persistent?: boolean;
}

export function useMqttSubscribe(
  topic: string | string[],
  {
    onMessage,
    persistent = false,
    ...subscribeOptions
  }: UseMqttSubscribeOptions,
) {
  const { getClient, status, user } = useMqtt();
  const onMessageRef = useRef(onMessage);
  const topicsRef = useRef(topic);

  // Update refs without re-running effects
  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    topicsRef.current = topic;
  }, [topic]);

  useEffect(() => {
    if (status !== "connected" || !getClient() || !user) {
      return;
    }

    const topicFactory = new TopicFactory(user.id);
    const topics = Array.isArray(topicsRef.current)
      ? topicsRef.current.map((t) => topicFactory.makeUserTopic(t))
      : [topicFactory.makeUserTopic(topicsRef.current)];

    getClient()?.subscribe(topics, subscribeOptions, (err) => {
      if (err) {
        console.error("[MQTT] Subscribe error:", err);
      }
    });

    const messageHandler = (receivedTopic: string, payload: Buffer) => {
      const parsed = topicFactory.parseUserTopic(receivedTopic);
      if (!parsed) {
        console.warn(
          `[MQTT] Ignoring message from unauthorized topic: ${receivedTopic}`,
        );
        return;
      }

      if (!topics.some((topic) => topic === receivedTopic)) {
        return;
      }

      onMessageRef.current({
        topic: parsed.topic,
        payload,
      });
    };

    getClient()?.on("message", messageHandler);

    // Cleanup
    return () => {
      if (!persistent) {
        getClient()?.unsubscribe(topics);
      }
      getClient()?.removeListener("message", messageHandler);
    };
  }, [getClient, status, user, subscribeOptions, persistent]);
}
