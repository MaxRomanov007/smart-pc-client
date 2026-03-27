import { type IPcLog, PcLogStatus } from "@/types/pc/pc-log";
import { useExtracted } from "next-intl";
import type LogBase from "@/components/pc/log/log-types/log-base";
import type { ComponentProps } from "react";
import { enumValueToKey } from "@/utils/enums/enum-value-to-key";

type Props = ComponentProps<typeof LogBase>;

type LogTypeConfig = {
  badge: string;
  colorPalette: string;
};

type LogTypeConfigs = Partial<Record<keyof typeof PcLogStatus, LogTypeConfig>>;

export function useLogTypeProps(log: IPcLog): Props | undefined {
  const t = useExtracted("use-log-types");

  const key = enumValueToKey(PcLogStatus, log.status);
  if (!key) return undefined;

  const configs: LogTypeConfigs = {
    ok: { badge: t("OK"), colorPalette: "green" },
    commandError: { badge: t("Error"), colorPalette: "yellow" },
    internalError: { badge: t("Internal"), colorPalette: "red" },
  };

  const config = configs[key];
  return config ? { log, ...config } : undefined;
}
