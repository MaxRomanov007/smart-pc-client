import { useEffect, useState, useCallback } from "react";
import mqtt, {
  type ClientSubscribeCallback,
  type IClientOptions,
  type MqttClient,
  type PacketCallback,
} from "mqtt";

const connectionStatuses = {
  disconnected: "disconnected",
  connecting: "connecting",
  connected: "connected",
  reconnecting: "reconnecting",
} as const;

export type ConnectionStatus =
  (typeof connectionStatuses)[keyof typeof connectionStatuses];

type UseMqttOptions = IClientOptions & {
  onMessage?: (topic: string, message: Buffer) => void;
};

type UseMqttResult = {
  client: MqttClient | null;
  status: ConnectionStatus;
  subscribe: (
    topic: string | string[],
    options?: ClientSubscribeCallback,
  ) => void;
  unsubscribe: (topic: string | string[]) => void;
  publish: (
    topic: string,
    message: string | Buffer,
    options?: PacketCallback,
  ) => void;
};

export default function useMqtt(
  brokerUrl: string,
  opts?: UseMqttOptions,
): UseMqttResult {
  const [connectStatus, setConnectStatus] = useState<ConnectionStatus>(
    connectionStatuses.disconnected,
  );
  const [client, setClient] = useState<MqttClient | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setConnectStatus(connectionStatuses.connecting);

    const mqttClient = mqtt.connect(brokerUrl, opts);
    setClient(mqttClient);

    return () => {
      if (mqttClient) {
        mqttClient.end(true);
      }
    };
  }, [brokerUrl, opts]);

  useEffect(() => {
    if (!client) return;

    const handleConnect = () => setConnectStatus(connectionStatuses.connected);
    const handleError = (err: Error) => {
      console.error("Connection error: ", err);
      setConnectStatus(connectionStatuses.disconnected);
    };
    const handleReconnect = () =>
      setConnectStatus(connectionStatuses.reconnecting);
    const handleDisconnect = () =>
      setConnectStatus(connectionStatuses.disconnected);
    const handleOffline = () =>
      setConnectStatus(connectionStatuses.disconnected);

    client.on("connect", handleConnect);
    client.on("error", handleError);
    client.on("reconnect", handleReconnect);
    client.on("disconnect", handleDisconnect);
    client.on("offline", handleOffline);

    return () => {
      client.off("connect", handleConnect);
      client.off("error", handleError);
      client.off("reconnect", handleReconnect);
      client.off("disconnect", handleDisconnect);
      client.off("offline", handleOffline);
    };
  }, [client]);

  useEffect(() => {
    if (!client || !opts?.onMessage) return;

    const handleMessage = (topic: string, message: Buffer) => {
      opts.onMessage?.(topic, message);
    };

    client.on("message", handleMessage);

    return () => {
      client.off("message", handleMessage);
    };
  }, [client, opts, opts?.onMessage]);

  // Методы управления
  const subscribe = useCallback(
    (topic: string | string[], callback?: ClientSubscribeCallback) => {
      if (client && connectStatus === connectionStatuses.connected) {
        client.subscribe(topic, callback);
      }
    },
    [client, connectStatus],
  );

  const unsubscribe = useCallback(
    (topic: string | string[]) => {
      if (client && connectStatus === connectionStatuses.connected) {
        client.unsubscribe(topic);
      }
    },
    [client, connectStatus],
  );

  const publish = useCallback(
    (topic: string, message: string | Buffer, options?: PacketCallback) => {
      if (client && connectStatus === connectionStatuses.connected) {
        client.publish(topic, message, options);
      }
    },
    [client, connectStatus],
  );

  return {
    client,
    status: connectStatus,
    subscribe,
    unsubscribe,
    publish,
  };
}
