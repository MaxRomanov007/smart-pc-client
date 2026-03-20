"use client";

/**
 * mqtt/provider.tsx
 *
 * ПРОБЛЕМА: каждые 30с TanStack Query делает фоновый refetch сессии.
 * Hydra всегда возвращает новый access_token → auth.accessToken меняется →
 * эффект видит tokenChanged=true → client.end() + reconnect.
 * Результат: MQTT рвётся каждые 30 секунд.
 *
 * РЕШЕНИЕ:
 * Убираем reconnect по смене токена вообще.
 * Вместо этого:
 * 1. При смене токена — обновляем client.options.password напрямую.
 *    mqtt.js читает его при следующем reconnect (если соединение упадёт).
 * 2. Принудительный reconnect делаем ТОЛЬКО при получении события
 *    "auth:mqtt-reauth" — его диспатчим из axios interceptor после 401+refresh.
 *    Это значит токен был реально протухший, а не просто ротированный.
 */

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

  const topicFactory = useMemo(
    () => (auth.user?.id ? new TopicFactory(auth.user.id) : null),
    [auth.user?.id],
  );

  // ─── Тихое обновление пароля при ротации токена ───────────────────────────
  //
  // Не переподключаемся. Просто обновляем пароль в опциях клиента.
  // mqtt.js использует client.options при следующем автоматическом reconnect.

  useEffect(() => {
    if (!auth.accessToken || !clientRef.current) return;

    // Обновляем пароль напрямую в объекте опций клиента
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (clientRef.current as any).options.password = auth.accessToken;
  }, [auth.accessToken]);

  // ─── Принудительный reconnect при реальной протухшей сессии ──────────────
  //
  // Событие "auth:mqtt-reauth" диспатчит axios interceptor после успешного
  // refresh по 401. Это единственный случай когда нам нужно переподключиться:
  // текущее соединение использует старый (невалидный) токен как MQTT password.

  useEffect(() => {
    const handleReauth = () => {
      const client = clientRef.current;
      const userId = auth.user?.id;
      const token = auth.accessToken;

      if (!client || !userId || !token) return;

      const url = `${brokerUrl}${wsPath}`;
      const newOptions: IClientOptions = {
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

      client.end(true);
      clientRef.current = null;

      const newClient = mqtt.connect(url, newOptions);
      clientRef.current = newClient;
      attachClientHandlers(newClient, setStatus, setError);
    };

    window.addEventListener("auth:mqtt-reauth", handleReauth);
    return () => window.removeEventListener("auth:mqtt-reauth", handleReauth);
  }, [auth.accessToken, auth.user?.id, brokerUrl, wsPath]);

  // ─── Основное подключение: только при смене userId / brokerUrl ────────────

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

    const url = `${brokerUrl}${wsPath}`;
    const mqttOptions: IClientOptions = {
      ...optionsRef.current,
      clientId:
        optionsRef.current.clientId ??
        `nextjs-${userId}-${Date.now().toString(36)}`,
      username: userId,
      password: auth.accessToken,
      clean: true,
      reconnectPeriod: 5_000,
      connectTimeout: 30_000,
      protocol: brokerUrl.startsWith("wss") ? "wss" : "ws",
    };

    const client = mqtt.connect(url, mqttOptions);
    clientRef.current = client;
    attachClientHandlers(client, setStatus, setError);

    return () => {
      client.end(true);
      clientRef.current = null;
    };
    // auth.accessToken намеренно не в deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.isAuthenticated, auth.user?.id, brokerUrl, wsPath]);

  // ─── publish / subscribe / disconnect ─────────────────────────────────────

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
) {
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
