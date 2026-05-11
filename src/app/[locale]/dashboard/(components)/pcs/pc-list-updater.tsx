"use client";

import { type IMqttMessage, MqttMessageTypes } from "@/types/mqtt";
import { useMemo, useState } from "react";
import type { IPc, IPcItem } from "@/types/pc/pc";
import PcList from "@/components/pc/pc-list";
import { useMqttJsonSubscribe } from "@/lib/mqtt/hooks/use-mqtt-json-subscribe";
import { useCommands } from "@/utils/hooks/commands/hook";
import { useExtracted } from "next-intl";

interface Props {
  pcs: IPc[];
}

export default function PcListUpdater({ pcs }: Props) {
  const [onlineMap, setOnlineMap] = useState<Record<string, boolean>>({});
  const t = useExtracted("pc-list-updater");

  const topics = useMemo(() => pcs.map((pc) => `pcs/${pc.id}/status`), [pcs]);
  useMqttJsonSubscribe<IMqttMessage<MqttMessageTypes.pcStatus>>(topics, {
    qos: 1,
    onMessage: (message) => {
      const changedPcId = getPcIdFromTopic(message.topic);
      const online = message.payload.data.status === "online";

      setOnlineMap((prev) => ({ ...prev, [changedPcId]: online }));
    },
  });

  const { doCommand } = useCommands();

  const pcItems = pcs.map((pc) => ({
    ...pc,
    online: onlineMap[pc.id] ?? false,
  }));

  const powerOnPc = (pc: IPcItem) => {
    doCommand({
      pc,
      commandId: "power-on",
      withoutDialog: true,
      messageType: MqttMessageTypes.wakerCommand,
    });
  };

  const powerOffPc = (pc: IPcItem) => {
    doCommand({
      pc,
      commandId: "power-off",
      text: t({
        message: "Are you sure you want to power off this PC?",
        description: "power off button dialog text",
      }),
    });
  };

  return <PcList pcs={pcItems} powerOn={powerOnPc} powerOff={powerOffPc} />;
}

function getPcIdFromTopic(topic: string) {
  const parts = topic.split("/");
  return parts[parts.length - 2];
}
