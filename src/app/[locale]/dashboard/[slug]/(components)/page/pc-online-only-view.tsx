"use client";

import type { IPc } from "@/types/pc/pc";
import { useMqttJsonSubscribe } from "@/lib/mqtt/hooks/use-mqtt-json-subscribe";
import { type IMqttMessage, MqttMessageTypes } from "@/types/mqtt";
import { useState } from "react";
import PcOfflineState from "@/app/[locale]/dashboard/[slug]/(components)/page/pc-offline-state";
import PcStateCard from "@/app/[locale]/dashboard/[slug]/(components)/pc-state/pc-state-card";

interface Props {
  pc: IPc;
}

export default function PcOnlineOnlyView({ pc }: Props) {
  const [isOnline, setIsOnline] = useState<boolean>(true);

  useMqttJsonSubscribe<IMqttMessage<MqttMessageTypes.pcStatus>>(
    `pcs/${pc.id}/status`,
    {
      qos: 1,
      onMessage(message) {
        setIsOnline(message.payload.data.status === "online");
      },
    },
  );

  if (!isOnline) {
    return <PcOfflineState pc={pc} />;
  }

  return <PcStateCard pc={pc} />;
}
