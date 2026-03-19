"use client";

import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import mqtt, {
  type IClientOptions,
  type IClientSubscribeOptions,
  MqttClient,
} from "mqtt";
import { TopicFactory } from "./utils/topic-factory";
import { MqttContext } from "./context";
import type {
  IMqttContext,
  MQTTError,
  MQTTMessage,
  MQTTProviderProps,
} from "./types";
import { useSecureAuth } from "@/utils/hooks/auth/client";

export function MQTTProvider({
  children,
  brokerUrl,
  wsPath = "/mqtt",
  options = {},
}: MQTTProviderProps) {
  const auth = useSecureAuth();
  const clientRef = useRef<MqttClient | null>(null);
  const [status, setStatus] = useState<IMqttContext["status"]>("offline");
  const [error, setError] = useState<MQTTError | undefined>();

  const topicFactory = useMemo(() => {
    return auth.user?.id ? new TopicFactory(auth.user.id) : null;
  }, [auth.user]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!auth.isAuthenticated || !auth.user?.id || !auth.token) {
      if (clientRef.current?.connected) {
        clientRef.current.end(true);
        clientRef.current = null;
      }
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStatus("offline");
      return;
    }

    // Prevent duplicate connections
    if (clientRef.current) return;

    const url = `${brokerUrl}${wsPath}`;
    const mqttOptions: IClientOptions = {
      ...options,
      clientId:
        options.clientId ??
        `nextjs-${auth.user!.id}-${Date.now().toString(36)}`,
      username: auth.user!.id,
      password: auth.token,
      clean: true,
      reconnectPeriod: 5000,
      connectTimeout: 30_000,
      protocol: brokerUrl.startsWith("wss") ? "wss" : "ws",
    };

    setStatus("connecting");

    const client = mqtt.connect(url, mqttOptions);
    clientRef.current = client;

    client.on("connect", () => {
      console.debug("[MQTT] Connected");
      setStatus("connected");
    });

    client.on("reconnect", () => {
      console.debug("[MQTT] Reconnecting");
      setStatus("connecting");
    });

    client.on("error", (err: Error) => {
      console.error("[MQTT] Error:", err);
      setError({ name: err.name, message: err.message, stack: err.stack });
      setStatus("error");
    });

    client.on("offline", () => {
      console.debug("[MQTT] Offline");
      setStatus("offline");
    });

    client.on("close", () => {
      console.debug("[MQTT] Closed");
      setStatus("offline");
      clientRef.current = null;
    });

    // Cleanup on unmount or auth change
    return () => {
      if (client.connected) {
        client.end(true);
      }
      clientRef.current = null;
    };
  }, [auth.isAuthenticated, auth.token, brokerUrl, wsPath, options, auth.user]);

  const publish = useCallback(
    async (message: MQTTMessage) => {
      if (!clientRef.current || !topicFactory) {
        throw new Error("MQTT client not connected or user not authenticated");
      }

      const fullTopic = topicFactory.makeUserTopic(message.topic);

      return new Promise<void>((resolve, reject) => {
        clientRef.current!.publish(
          fullTopic,
          message.payload,
          {
            qos: message.qos ?? 1,
            retain: message.retain,
          },
          (err) => {
            if (err) reject(err);
            else resolve();
          },
        );
      });
    },
    [topicFactory],
  );

  const subscribe = useCallback(
    (topic: string, options?: IClientSubscribeOptions) => {
      if (!clientRef.current || !topicFactory) {
        return () => {};
      }

      const fullTopic = topicFactory.makeUserTopic(topic);

      clientRef.current.subscribe(fullTopic, { qos: 1, ...options }, (err) => {
        if (err) console.error(`[MQTT] Subscribe error for ${fullTopic}:`, err);
      });

      return () => {
        clientRef.current?.unsubscribe(fullTopic);
      };
    },
    [topicFactory],
  );

  const disconnect = () => {
    if (clientRef.current?.connected) {
      clientRef.current.end(true);
      clientRef.current = null;
    }
  };

  const getClient = useCallback(() => clientRef.current, [clientRef]);

  const value: IMqttContext = useMemo(
    () => ({
      status,
      error,
      getClient,
      user: auth.user,
      publish,
      subscribe,
      disconnect,
    }),
    [status, error, getClient, auth.user, publish, subscribe],
  );

  return <MqttContext.Provider value={value}>{children}</MqttContext.Provider>;
}

export function useMqtt() {
  const context = useContext(MqttContext);
  if (context === undefined) {
    throw new Error("useMqtt must be used within MQTTProvider");
  }
  return context;
}
