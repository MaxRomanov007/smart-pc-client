import { useMqtt } from "@/lib/mqtt/provider";

export function useMqttState() {
  const { status, error, getClient, user } = useMqtt();

  return {
    isConnected: status === "connected",
    status,
    error,
    client: getClient(),
    user,
  };
}
