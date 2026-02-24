"use client";

import { MessageTypes, type MqttMessage } from "@/types/mqtt";
import { useCallback, useMemo, useState } from "react";
import type { IPc, IPcItem } from "@/types/pc/pc";
import PcList from "@/components/pc/pc-list";
import { useMqttJsonSubscribe } from "@/lib/mqtt/hooks/use-mqtt-json-subscribe";

interface Props {
  pcs: IPc[];
  token: string;
  userID: string;
}

export default function PcListUpdater({ token, pcs, userID }: Props) {
  const [pcItems, setPcItems] = useState<IPcItem[]>(
    pcs.map<IPcItem>((pc) => ({ ...pc, online: false })),
  );

  const topics = useMemo(() => pcs.map((pc) => `pcs/${pc.id}/status`), [pcs]);
  useMqttJsonSubscribe<MqttMessage>(topics, {
    onMessage: (message) => {
      if (message.payload.type !== MessageTypes.pcStatus) {
        return;
      }

      const changedPcId = getPcIdFromTopic(message.topic);
      const online = message.payload.data.status === "online";

      setPcItems((prevItems) =>
        prevItems.map((pcItem) =>
          pcItem.id === changedPcId ? { ...pcItem, online } : pcItem,
        ),
      );
    },
    qos: 1,
  });

  const powerOnPc = (pc: IPcItem) => {
    // TODO: Handle pc power on function
  };

  return <PcList pcs={pcItems} powerOn={powerOnPc} />;
}

function getPcIdFromTopic(topic: string) {
  const parts = topic.split("/");
  return parts[parts.length - 2];
}
