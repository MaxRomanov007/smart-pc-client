"use client";

import type { IPc } from "@/types/pc/pc";
import { useMqttJsonSubscribe } from "@/lib/mqtt/hooks/use-mqtt-json-subscribe";
import { MessageTypes, type MqttMessage } from "@/types/mqtt";
import { useState } from "react";
import PcOfflineState from "@/app/[locale]/dashboard/[slug]/(components)/pc-offline-state";

interface Props {
  pc: IPc;
}

export default function PcOnlineOnlyView({ pc }: Props) {
  const [isOnline, setIsOnline] = useState<boolean>(false);

  useMqttJsonSubscribe<MqttMessage>(`pcs/${pc.id}/status`, {
    qos: 1,
    onMessage(message) {
      if (message.payload.type !== MessageTypes.pcStatus) {
        return;
      }

      setIsOnline(message.payload.data.status === "online");
    },
  });

  if (!isOnline) {
    return <PcOfflineState pc={pc} />;
  }

  return <div>{isOnline ? "Yes" : "No"}</div>;
}
