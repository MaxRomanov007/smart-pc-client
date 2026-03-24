"use client";

import { useExtracted } from "next-intl";
import type { IPc } from "@/types/pc/pc";
import { LuMonitorOff } from "react-icons/lu";
import { useStandardTabs } from "@/utils/hooks/ui/tabs/client";
import { useCallback, useMemo } from "react";
import { PAGES } from "@/config/navigation/pages";
import LinkButton from "@/components/ui/button/link-button";
import PowerOnButton from "@/components/pc/power-on-button";
import { useCommands } from "@/utils/hooks/commands/hook";
import { MqttMessageTypes } from "@/types/mqtt";
import NotificationPage from "@/components/ui/pages/notification-page";

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
      commandId: "power-on",
      withoutDialog: true,
      messageType: MqttMessageTypes.wakerCommand,
    });
    await new Promise((r) => setTimeout(r, 1000));
  }, [doCommand, pc]);

  return (
    <>
      <NotificationPage
        icon={<LuMonitorOff />}
        title={t({
          message: "PC is offline",
          description: "title",
        })}
        description={
          pc.canPowerOn
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
              })
        }
      >
        <LinkButton href={PAGES.dashboard}>
          {t({
            message: "Go to {pageName}",
            values: {
              pageName: dashboardTab?.label ?? "",
            },
          })}
        </LinkButton>

        {pc.canPowerOn && <PowerOnButton onClick={handlePowerOn} />}
      </NotificationPage>
    </>
  );
}
