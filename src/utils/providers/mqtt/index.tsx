"use client";

import { MQTTProvider } from "@/lib/mqtt/provider";
import type { ReactNode } from "react";

export default function MQTTConnectionProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <MQTTProvider
      brokerUrl={process.env.NEXT_PUBLIC_MQTT_BROKER_URL!}
      wsPath="/mqtt"
      options={{
        keepalive: 60,
        resubscribe: true,
      }}
    >
      {children}
    </MQTTProvider>
  );
}
