"use client";

import { MessageTypes, type MqttMessage } from "@/types/mqtt";
import { useMemo, useState } from "react";
import type { IPc, IPcItem } from "@/types/pc/pc";
import PcList from "@/components/pc/pc-list";
import { useMqttJsonSubscribe } from "@/lib/mqtt/hooks/use-mqtt-json-subscribe";
import { useCommands } from "@/utils/hooks/commands/hook";
import { ParameterTypes } from "@/types/pc/command-parameter";

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
      name: "hello",
      params: [
        {
          id: "1",
          name: "param1",
          description: "some description",
          type: ParameterTypes.boolean,
          value: false,
        },
        {
          id: "2",
          name: "param2",
          description: "some description",
          type: ParameterTypes.number,
          value: 0,
        },
        {
          id: "3",
          name: "param3",
          description: "some description",
          type: ParameterTypes.string,
          value: "",
        },
      ],
    });
  };

  return <PcList pcs={pcItems} powerOn={powerOnPc} />;
}

function getPcIdFromTopic(topic: string) {
  const parts = topic.split("/");
  return parts[parts.length - 2];
}
