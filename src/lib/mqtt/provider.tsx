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
  type MqttClient,
} from "mqtt";
import { TopicFactory } from "./utils/topic-factory";
import { MqttContext } from "./context";
import type {
  IMqttContext,
  MQTTConnectionStatus,
  MQTTError,
  MQTTMessage,
  MQTTProviderProps,
} from "./types";
import { useAuth } from "@/lib/auth/use-auth";

function isNotAuthorizedError(err: Error): boolean {
  if (
    "reasonCode" in err &&
    (err as { reasonCode: number }).reasonCode === 135
  ) {
    return true;
  }

  return err.message.toLowerCase().includes("not authorized");
}

export function MQTTProvider({
  children,
  brokerUrl,
  wsPath = "/mqtt",
  options = {},
}: MQTTProviderProps) {
  const auth = useAuth();
  const clientRef = useRef<MqttClient | null>(null);
  const [status, setStatus] = useState<MQTTConnectionStatus>("offline");
  const [error, setError] = useState<MQTTError | undefined>();

  const optionsRef = useRef<typeof options>(options);

  const getValidTokenRef = useRef(auth.getValidToken);
  useEffect(() => {
    getValidTokenRef.current = auth.getValidToken;
  }, [auth.getValidToken]);

  const topicFactory = useMemo(
    () => (auth.user?.id ? new TopicFactory(auth.user.id) : null),
    [auth.user?.id],
  );

  const createAndAttachClient = useCallback(
    (userId: string, token: string): MqttClient => {
      const url = `${brokerUrl}${wsPath}`;
      const mqttOptions: IClientOptions = {
        ...optionsRef.current,
        clientId:
          optionsRef.current.clientId ??
          `nextjs-${userId}-${Date.now().toString(36)}`,
        username: userId,
        password: token,
        clean: true,
        reconnectPeriod: 5_000,
        connectTimeout: 30_000,
        protocol: brokerUrl.startsWith("wss") ? "wss" : "ws",
      };

      const client = mqtt.connect(url, mqttOptions);

      attachClientHandlers(client, setStatus, setError, async () => {
        clientRef.current = null;
        setStatus("connecting");

        const freshToken = await getValidTokenRef.current();
        if (!freshToken) {
          console.error("[MQTT] Not authorized: can't get fresh token");
          setStatus("error");
          return;
        }

        console.debug(
          "[MQTT] Not authorized: recreating client with fresh token",
        );
        clientRef.current = createAndAttachClient(userId, freshToken);
      });

      return client;
    },
    [brokerUrl, wsPath],
  );

  useEffect(() => {
    if (!auth.accessToken || !clientRef.current) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (clientRef.current as any).options.password = auth.accessToken;
  }, [auth.accessToken]);

  useEffect(() => {
    const handleReauth = async () => {
      const client = clientRef.current;
      const userId = auth.user?.id;

      if (!userId) return;

      const freshToken = await getValidTokenRef.current();
      if (!freshToken) return;

      if (client) {
        client.end(true);
        clientRef.current = null;
      }

      clientRef.current = createAndAttachClient(userId, freshToken);
    };

    window.addEventListener("auth:mqtt-reauth", handleReauth);
    return () => window.removeEventListener("auth:mqtt-reauth", handleReauth);
  }, [auth.user?.id, createAndAttachClient]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const userId = auth.user?.id;

    if (!auth.isAuthenticated || !userId || !auth.accessToken) {
      if (clientRef.current) {
        clientRef.current.end(true);
        clientRef.current = null;
      }
      return;
    }

    if (clientRef.current) return;

    const client = createAndAttachClient(userId, auth.accessToken);
    clientRef.current = client;

    return () => {
      client.end(true);
      clientRef.current = null;
    };
    // auth.accessToken намеренно не в deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.isAuthenticated, auth.user?.id, createAndAttachClient]);

  const publish = useCallback(
    async (message: MQTTMessage): Promise<void> => {
      const client = clientRef.current;
      if (!client?.connected) throw new Error("MQTT client not connected");
      if (!topicFactory) throw new Error("User not authenticated");

      const fullTopic = topicFactory.makeUserTopic(message.topic);
      return new Promise<void>((resolve, reject) => {
        client.publish(
          fullTopic,
          message.payload,
          { qos: message.qos ?? 1, retain: message.retain },
          (err) => (err ? reject(err) : resolve()),
        );
      });
    },
    [topicFactory],
  );

  const subscribe = useCallback(
    (
      topic: string,
      subscribeOptions?: IClientSubscribeOptions,
    ): (() => void) => {
      const client = clientRef.current;
      if (!client || !topicFactory) return () => {};

      const fullTopic = topicFactory.makeUserTopic(topic);
      client.subscribe(fullTopic, { qos: 1, ...subscribeOptions }, (err) => {
        if (err) console.error(`[MQTT] Subscribe error for ${fullTopic}:`, err);
      });

      return () => client.unsubscribe(fullTopic);
    },
    [topicFactory],
  );

  const disconnect = useCallback(() => {
    if (clientRef.current) {
      clientRef.current.end(true);
      clientRef.current = null;
    }
  }, []);

  const getClient = useCallback(() => clientRef.current, []);

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
    [status, error, getClient, auth.user, publish, subscribe, disconnect],
  );

  return <MqttContext.Provider value={value}>{children}</MqttContext.Provider>;
}

function attachClientHandlers(
  client: MqttClient,
  setStatus: (s: MQTTConnectionStatus) => void,
  setError: (e: MQTTError | undefined) => void,
  onNotAuthorized: () => void,
) {
  let isHandlingAuthError = false;

  client.on("connect", () => {
    console.debug("[MQTT] Connected");
    setStatus("connected");
    setError(undefined);
  });
  client.on("reconnect", () => {
    console.debug("[MQTT] Reconnecting");
    setStatus("connecting");
  });
  client.on("error", (err: Error) => {
    if (isNotAuthorizedError(err)) {
      if (isHandlingAuthError) return;
      isHandlingAuthError = true;

      console.warn("[MQTT] Not authorized — stopping client, refreshing token");
      client.end(true);
      onNotAuthorized();
      return;
    }

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
  });
}

export function useMqtt(): IMqttContext {
  const context = useContext(MqttContext);
  if (context === undefined) {
    throw new Error("useMqtt must be used within MQTTProvider");
  }
  return context;
}
