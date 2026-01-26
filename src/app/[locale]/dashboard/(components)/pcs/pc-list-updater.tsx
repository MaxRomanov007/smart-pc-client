"use client";

import { MessageTypes, type WebsocketMessage } from "@/@types/websocket";
import useWebSocket from "react-use-websocket";
import { PATHS } from "@/config/websocket/paths";
import type { IPc, IPcItem } from "@/@types/pc/pc";
import { useCallback, useEffect, useState } from "react";
import PcList from "@/components/pc/pc-list";

interface Props {
  pcs: IPc[];
  token: string;
}

export default function PcListUpdater({ token, pcs }: Props) {
  const [pcItems, setPcItems] = useState<IPcItem[]>(
    pcs.map<IPcItem>((pc) => ({ ...pc, online: false })),
  );

  const { lastJsonMessage } = useWebSocket<WebsocketMessage | null>(
    PATHS.pcsStatuses(token),
    {
      shouldReconnect: () => true,
      onMessage: (event) => {
        try {
          const message: WebsocketMessage | null = JSON.parse(event.data);
          if (!message) {
            return;
          }
          handleMessage(message);
        } catch (error) {
          console.error(error);
        }
      },
    },
  );

  const handleMessage = useCallback((message: WebsocketMessage) => {
    if (message.payload.type !== MessageTypes.pcStatus) {
      return;
    }

    const changedPcId = getPcIdFromTopic(message.Topic);
    const online = message.payload.data.status === "online";

    setPcItems((prevItems) =>
      prevItems.map((pcItem) =>
        pcItem.id === changedPcId ? { ...pcItem, online } : pcItem,
      ),
    );
  }, []);

  useEffect(() => {
    if (!lastJsonMessage) return;

    handleMessage(lastJsonMessage);
  }, [handleMessage, lastJsonMessage]);

  return <PcList pcs={pcItems} />;
}

function getPcIdFromTopic(topic: string) {
  const parts = topic.split("/");
  return parts[parts.length - 2];
}
