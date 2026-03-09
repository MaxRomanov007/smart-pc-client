"use client";

import { Card } from "@chakra-ui/react";
import { useExtracted } from "next-intl";
import type { IPc } from "@/types/pc/pc";
import { PcInfo } from "@/app/[locale]/dashboard/[slug]/(components)/pc-state/pc-info";
import type { IPcStateData } from "@/types/mqtt/pc-state";
import { useState } from "react";
import { type IMqttMessage, MqttMessageTypes } from "@/types/mqtt";
import { useMqttJsonSubscribe } from "@/lib/mqtt/hooks/use-mqtt-json-subscribe";

interface Props {
  pc: IPc;
}

export default function PcStateCard({ pc }: Props) {
  const t = useExtracted("pc-state-card");
  const [state, setState] = useState<IPcStateData>({
    cpuPercent: 0,
    virtualMemory: {
      total: 0,
      available: 0,
    },
    volume: {
      current: 100,
      muted: false,
    },
  });

  useMqttJsonSubscribe<IMqttMessage<MqttMessageTypes.pcState>>(
    `pcs/${pc.id}/state`,
    {
      qos: 1,
      onMessage(message) {
        const newData = message.payload.data;

        if (!newData) return;

        setState((prev) => {
          const merged: IPcStateData = {
            ...newData,
            volume: newData.volume
              ? {
                  current: newData.volume.current ?? prev?.volume?.current,
                  muted: newData.volume.muted ?? prev?.volume?.muted,
                }
              : prev?.volume,
          };

          if (JSON.stringify(prev) === JSON.stringify(merged)) return prev;
          return merged;
        });
      },
    },
  );

  return (
    <Card.Root>
      <Card.Header>
        <Card.Title as={Card.Title}>
          {t({
            message: "PC State",
            description: "card title",
          })}
        </Card.Title>
        <Card.Description>
          {t({
            message: "State of PC {name}",
            values: {
              name: pc.name,
            },
            description: "card description",
          })}
        </Card.Description>
      </Card.Header>

      <Card.Body>
        <PcInfo
          pc={pc}
          volumeState={state.volume}
          onVolumeChange={(volume) => setState({ ...state, volume })}
        />
      </Card.Body>
    </Card.Root>
  );
}
