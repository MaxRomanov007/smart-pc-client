"use client";

import { MessageTypes, type MqttMessage } from "@/types/mqtt";
import { useMemo, useState } from "react";
import type { IPc, IPcItem } from "@/types/pc/pc";
import PcList from "@/components/pc/pc-list";
import { useMqttJsonSubscribe } from "@/lib/mqtt/hooks/use-mqtt-json-subscribe";
import { useCommands } from "@/utils/hooks/commands/hook";

interface Props {
  pcs: IPc[];
}

export default function PcListUpdater({ pcs }: Props) {
  const [pcItems, setPcItems] = useState<IPcItem[]>(
    pcs.map<IPcItem>((pc) => ({ ...pc, online: false })),
  );

  const topics = useMemo(() => pcs.map((pc) => `pcs/${pc.id}/status`), [pcs]);
  useMqttJsonSubscribe<MqttMessage>(topics, {
    qos: 1,
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
  });

  const { doCommand } = useCommands();

  const powerOnPc = (pc: IPcItem) => {
    doCommand({
      pc,
      name: "power-on",
      withoutDialog: true,
      messageType: MessageTypes.wakerCommand
    });
  };

  return <PcList pcs={pcItems} powerOn={powerOnPc} />;
}

function getPcIdFromTopic(topic: string) {
  const parts = topic.split("/");
  return parts[parts.length - 2];
}
