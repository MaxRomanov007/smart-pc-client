import { useMqtt } from "@/lib/mqtt/provider";

export function useMqttState() {
  const { status, error, client, user } = useMqtt();

  return {
    isConnected: status === "connected",
    status,
    error,
    client,
    user,
  };
}
