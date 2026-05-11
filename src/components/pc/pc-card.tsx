"use client";

import { Card, Flex, Float, HStack, Spacer } from "@chakra-ui/react";
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
import DeleteButton from "@/components/button/delete-button";
import ConfirmationDialog from "@/components/ui/dialog/confirmation-dialog/dialog";
import { useDeletePcMutation } from "@/utils/hooks/queries/pcs/mutations/use-delete-pc-mutation";
import PowerOffButton from "@/components/pc/power-off-button";

interface Props {
  pc: IPcItem;
  powerOn?: () => void;
  powerOff?: () => void;
}

export default function PcCard({ pc, powerOn, powerOff }: Props) {
  const t = useExtracted("pc-card");

  const { mutate } = useDeletePcMutation(pc.id);

  const handePowerOn = useCallback(async () => {
    powerOn?.();
    await new Promise((r) => setTimeout(r, 1000));
  }, [powerOn]);

  const handePowerOff = useCallback(async () => {
    powerOff?.();
    await new Promise((r) => setTimeout(r, 1000));
  }, [powerOff]);

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
        <Spacer />

        {!pc.online && (
          <Float placement="middle-end" offset={11}>
            <ConfirmationDialog
              title={t({
                message: "Are you sure you want to delete this PC?",
                description: "delete this pc confirmation dialog title",
              })}
              content={t({
                message: "All data and commands will be lost forever.",
                description: "delete this pc confirmation dialog description",
              })}
              tooltip={t({
                message: "Delete this PC",
                description: "delete this pc button text",
              })}
              confirmButtonProps={{ colorPalette: "red", variant: "outline" }}
              cancelButtonProps={{ variant: "solid" }}
              onConfirm={() => mutate()}
            >
              <DeleteButton variant="ghost" />
            </ConfirmationDialog>
          </Float>
        )}
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
            onClick={handePowerOn}
          />

          <PowerOffButton hidden={!pc.online} onClick={handePowerOff} />
        </HStack>
      </Card.Footer>
    </Card.Root>
  );
}
