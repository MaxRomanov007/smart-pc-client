"use client";

import { MessageTypes, type WebsocketMessage } from "@/@types/websocket";
import { useCallback, useEffect, useState } from "react";
import type { IPc, IPcItem } from "@/@types/pc/pc";
import PcList from "@/components/pc/pc-list";
import useMqtt from "@/utils/hooks/mqtt";

interface Props {
  pcs: IPc[];
  token: string;
  userID: string;
}

const mqttBrokerUrl = "ws://localhost:8083/mqtt" as const;

export default function PcListUpdater({ token, pcs, userID }: Props) {
  const [pcItems, setPcItems] = useState<IPcItem[]>(
    pcs.map<IPcItem>((pc) => ({ ...pc, online: false })),
  );

  const handleMqttMessage = useCallback((topic: string, message: Buffer) => {
    try {
      const messageStr = message.toString();
      const parsedMessage: WebsocketMessage = JSON.parse(messageStr);

      if (parsedMessage.type !== MessageTypes.pcStatus) {
        return;
      }

      const changedPcId = getPcIdFromTopic(topic);
      const online = parsedMessage.data.status === "online";

      setPcItems((prevItems) =>
        prevItems.map((pcItem) =>
          pcItem.id === changedPcId ? { ...pcItem, online } : pcItem,
        ),
      );
    } catch (error) {
      console.error("Error parsing MQTT message:", error);
    }
  }, []);

  const { status, subscribe } = useMqtt(mqttBrokerUrl, {
    onMessage: handleMqttMessage,
    clientId: `pc-client-` + userID,
    username: userID,
    password: token,
    clean: true,
    reconnectPeriod: 1000,
  });

  useEffect(() => {
    if (status === "connected") {
      const topics = pcs.map((pc) => `users/${userID}/pcs/${pc.id}/status`);
      subscribe(topics);
    }
  }, [status, subscribe, pcs, userID]);

  return <PcList pcs={pcItems} />;
}

function getPcIdFromTopic(topic: string) {
  const parts = topic.split("/");
  return parts[parts.length - 2];
}
