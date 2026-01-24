"use client";

import { Card, Flex, HStack, IconButton, Spacer } from "@chakra-ui/react";
import type { IPc } from "@/@types/pc/pc";
import LinkButton from "@/components/ui/button/link-button";
import { PAGES } from "@/config/navigation/pages";
import { LuActivity, LuMonitor, LuPower } from "react-icons/lu";
import { useExtracted } from "next-intl";
import AccentIcon from "@/components/ui/icon/accent-icon";
import useWebSocket from "react-use-websocket";
import { PATHS } from "@/config/websocket/paths";
import { MessageTypes, type WebsocketMessage } from "@/@types/websocket";
import OnlineBadge from "../ui/badge/online-badge/client";
import OfflineBadge from "../ui/badge/offline-badge/client";

interface Props {
  pc: IPc;
  token: string;
}

export default function PcCard({ pc, token }: Props) {
  const t = useExtracted("pc-card");
  const { lastJsonMessage } = useWebSocket<WebsocketMessage | null>(
    PATHS.pcStatus(token, pc.id),
    {
      shouldReconnect: () => true,
    },
  );

  const isOnline: boolean =
    lastJsonMessage !== null &&
    lastJsonMessage.type === MessageTypes.pcStatus &&
    lastJsonMessage.data.status === "online";

  return (
    <Card.Root>
      <Card.Body gap="2">
        <Flex>
          <AccentIcon size="lg">
            <LuMonitor />
          </AccentIcon>
          <Spacer />
          {isOnline ? <OnlineBadge /> : <OfflineBadge />}
        </Flex>
        <Card.Title>{pc.name}</Card.Title>
        <Card.Description>{pc.description}</Card.Description>
      </Card.Body>
      <Card.Footer>
        <HStack w="full">
          <LinkButton
            href={PAGES.pc(pc.slug)}
            flexGrow={1}
            disabled={!isOnline}
            variant="subtle"
          >
            <LuActivity />
            {t({
              message: "Execute",
              description: "link button text",
            })}
          </LinkButton>

          <IconButton hidden={isOnline || !pc.canPowerOn} variant="outline">
            <LuPower />
          </IconButton>
        </HStack>
      </Card.Footer>
    </Card.Root>
  );
}
