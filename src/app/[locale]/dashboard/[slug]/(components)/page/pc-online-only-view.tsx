"use client";

import type { IPc } from "@/types/pc/pc";
import { useMqttJsonSubscribe } from "@/lib/mqtt/hooks/use-mqtt-json-subscribe";
import { type IMqttMessage, MqttMessageTypes } from "@/types/mqtt";
import { type ComponentProps, useState } from "react";
import PcOfflineState from "@/app/[locale]/dashboard/[slug]/(components)/page/pc-offline-state";
import PcStateCard from "@/app/[locale]/dashboard/[slug]/(components)/pc-state/pc-state-card";
import { Flex } from "@chakra-ui/react";
import PcCommandsCard from "@/app/[locale]/dashboard/[slug]/(components)/commands/pc-commands-card";

interface Props extends ComponentProps<typeof Flex> {
  pc: IPc;
}

export default function PcOnlineOnlyView({ pc, ...rest }: Props) {
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

  return (
    <Flex direction="column" gap={4} h={"full"} {...rest}>
      <PcStateCard pc={pc} flexShrink={0} />
      <Flex
        gap={4}
        flexGrow={1}
        minH={0}
        direction={["column", null, null, "row"]}
      >
        <PcCommandsCard
          pc={pc}
          flexGrow={1}
          overflow="hidden"
          display="flex"
          flexDirection="column"
          minH={0}
        />
        <PcCommandsCard
          pc={pc}
          flexGrow={1}
          overflow="hidden"
          display="flex"
          flexDirection="column"
          minH={0}
        />
      </Flex>
    </Flex>
  );
}
