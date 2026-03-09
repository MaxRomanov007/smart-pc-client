"use client";

import { Card, Flex } from "@chakra-ui/react";
import { useExtracted } from "next-intl";
import type { IPc } from "@/types/pc/pc";
import { PcInfo } from "@/app/[locale]/dashboard/[slug]/(components)/pc-state/pc-info";
import type { IPcStateData } from "@/types/mqtt/pc-state";
import { useCallback, useState } from "react";
import { type IMqttMessage, MqttMessageTypes } from "@/types/mqtt";
import { useMqttJsonSubscribe } from "@/lib/mqtt/hooks/use-mqtt-json-subscribe";
import Metrics from "@/app/[locale]/dashboard/[slug]/(components)/pc-state/metrics";

interface Props {
  pc: IPc;
}

const INITIAL_STATE: IPcStateData = {
  cpuPercent: 0,
  virtualMemory: { total: 0, available: 0 },
  volume: { current: 100, muted: false },
};

export default function PcStateCard({ pc }: Props) {
  const t = useExtracted("pc-state-card");
  const [state, setState] = useState<IPcStateData>(INITIAL_STATE);

  const onMessage = useCallback(
    (message: { payload: IMqttMessage<MqttMessageTypes.pcState> }) => {
      const newData = message.payload.data;

      setState((prev) => {
        const nextVolume = newData.volume
          ? {
              current: newData.volume.current ?? prev.volume?.current,
              muted: newData.volume.muted ?? prev.volume?.muted,
            }
          : prev.volume;

        if (
          newData.cpuPercent === prev.cpuPercent &&
          newData.virtualMemory?.total === prev.virtualMemory?.total &&
          newData.virtualMemory?.available === prev.virtualMemory?.available &&
          nextVolume?.current === prev.volume?.current &&
          nextVolume?.muted === prev.volume?.muted
        ) {
          return prev;
        }

        return { ...newData, volume: nextVolume };
      });
    },
    [],
  );

  useMqttJsonSubscribe<IMqttMessage<MqttMessageTypes.pcState>>(
    `pcs/${pc.id}/state`,
    { qos: 1, onMessage },
  );

  return (
    <Card.Root>
      <Card.Header>
        <Card.Title as={Card.Title}>
          {t({ message: "PC State", description: "card title" })}
        </Card.Title>
        <Card.Description>
          {t({
            message: "State of PC {name}",
            values: { name: pc.name },
            description: "card description",
          })}
        </Card.Description>
      </Card.Header>

      <Card.Body>
        <Flex direction={["column", null, null, null, "row"]} gap={4}>
          <PcInfo
            pc={pc}
            volumeState={state.volume}
            onVolumeChange={(volume) =>
              setState((prev) => ({ ...prev, volume }))
            }
          />

          <Metrics
            cpuPercent={state.cpuPercent}
            virtualMemory={state.virtualMemory}
          />
        </Flex>
      </Card.Body>
    </Card.Root>
  );
}
