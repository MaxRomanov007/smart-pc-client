"use client";

import { useExtracted } from "next-intl";
import {
  AbsoluteCenter,
  Container,
  Heading,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";
import AccentIcon from "@/components/ui/icon/accent-icon";
import type { IPc } from "@/types/pc/pc";
import { LuMonitorOff } from "react-icons/lu";
import { useStandardTabs } from "@/utils/hooks/ui/tabs/client";
import { useCallback, useMemo } from "react";
import { PAGES } from "@/config/navigation/pages";
import LinkButton from "@/components/ui/button/link-button";
import PowerOnButton from "@/components/pc/power-on-button";
import { useCommands } from "@/utils/hooks/commands/hook";
import { MessageTypes } from "@/types/mqtt";

interface Props {
  pc: IPc;
}

export default function PcOfflineState({ pc }: Props) {
  const t = useExtracted("pc-offline-state");
  const tabs = useStandardTabs();
  const dashboardTab = useMemo(
    () => tabs.find((tab) => tab.href === PAGES.dashboard),
    [tabs],
  );

  const { doCommand } = useCommands();
  const handlePowerOn = useCallback(async () => {
    doCommand({
      pc,
      name: "power-on",
      withoutDialog: true,
      messageType: MessageTypes.wakerCommand,
    });
    await new Promise((r) => setTimeout(r, 1000));
  }, [doCommand, pc]);

  return (
    <AbsoluteCenter h="full">
      <Container maxW="sm">
        <VStack textAlign="center" gap={4}>
          <AccentIcon w={24} h={24}>
            <LuMonitorOff />
          </AccentIcon>
          <Heading as="h1">
            {t({
              message: "PC is offline",
              description: "title",
            })}
          </Heading>
          <Text color="fg.muted" lineClamp={3}>
            {pc.canPowerOn
              ? t({
                  message:
                    "This PC is offline, click on button below, to go to {pageName} page, or try to power it on",
                  values: {
                    pageName: dashboardTab?.label ?? "",
                  },
                })
              : t({
                  message:
                    "This PC is offline, click on button below, to go to {pageName} page",
                  values: {
                    pageName: dashboardTab?.label ?? "",
                  },
                })}
          </Text>
          <HStack>
            <LinkButton href={PAGES.dashboard}>
              {t({
                message: "Go to {pageName}",
                values: {
                  pageName: dashboardTab?.label ?? "",
                },
              })}
            </LinkButton>

            <PowerOnButton hidden={!pc.canPowerOn} onClick={handlePowerOn} />
          </HStack>
        </VStack>
      </Container>
    </AbsoluteCenter>
  );
}
