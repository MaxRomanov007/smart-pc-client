"use client";

import { Card, Flex, HStack, Spacer } from "@chakra-ui/react";
import type { IPcItem } from "@/types/pc/pc";
import LinkButton from "@/components/ui/button/link-button";
import { PAGES } from "@/config/navigation/pages";
import { LuActivity, LuMonitor, LuMonitorOff } from "react-icons/lu";
import AccentIcon from "@/components/ui/icon/accent-icon";
import { useExtracted } from "next-intl";
import OnlineBadge from "../ui/badge/online-badge/client";
import OfflineBadge from "../ui/badge/offline-badge/client";
import { useCallback } from "react";
import PowerOnButton from "@/components/pc/power-on-button";

interface Props {
  pc: IPcItem;
  powerOn?: () => void;
}

export default function PcCard({ pc, powerOn }: Props) {
  const t = useExtracted("pc-card");

  const handleClick = useCallback(async () => {
    powerOn?.();
    await new Promise((r) => setTimeout(r, 1000));
  }, [powerOn]);

  return (
    <Card.Root opacity={pc.online || pc.canPowerOn ? 1 : 0.6}>
      <Card.Body gap="2">
        <Flex>
          <AccentIcon size="lg" colorPalette={!pc.online ? "gray" : undefined}>
            {pc.online ? <LuMonitor /> : <LuMonitorOff />}
          </AccentIcon>
          <Spacer />
          {pc.online ? <OnlineBadge /> : <OfflineBadge />}
        </Flex>
        <Card.Title>{pc.name}</Card.Title>
        <Card.Description lineClamp="2">{pc.description}</Card.Description>
      </Card.Body>
      <Card.Footer>
        <HStack w="full">
          <LinkButton
            href={PAGES.pc(pc.slug)}
            flexGrow={1}
            disabled={!pc.online}
            variant={pc.online ? "solid" : "subtle"}
          >
            <LuActivity />
            {t({
              message: "Execute",
              description: "link button text",
            })}
          </LinkButton>

          <PowerOnButton
            hidden={pc.online || !pc.canPowerOn}
            onClick={handleClick}
          />
        </HStack>
      </Card.Footer>
    </Card.Root>
  );
}
