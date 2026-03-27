import type { ComponentProps } from "react";
import { InfoTip } from "@/components/ui/chakra/toggle-tip";
import type { IPcLog } from "@/types/pc/pc-log";
import { Grid, Text } from "@chakra-ui/react";
import { useExtracted } from "next-intl";
import ValueText from "@/components/pc/log/log-info-tip/value-text";

interface Props extends ComponentProps<typeof InfoTip> {
  log: IPcLog;
}

export default function LogInfoTip({ log, ...props }: Props) {
  const t = useExtracted("log-info-tip");

  return (
    <InfoTip positioning={{ placement: "left-start" }} {...props}>
      <Grid templateColumns="repeat(2, auto)" gap={4} m={4}>
        <Text>{t("Status:")}</Text>
        <ValueText>
          {t({
            message:
              "{status, select, ok {Success} command_error {Command failed} internal_error {Internal error} other {Completed}}",
            values: {
              status: log.status.replace("-", "_"),
            },
            description: "status translation",
          })}
        </ValueText>

        <Text>{t("Command ID:")}</Text>
        <ValueText>{log.commandId}</ValueText>

        {log.commandName && (
          <>
            <Text>{t("Command name:")}</Text>
            <ValueText>{log.commandName}</ValueText>
          </>
        )}

        {log.error && (
          <>
            <Text>{t("Error:")}</Text>
            <ValueText>{log.error}</ValueText>
          </>
        )}

        <Text>{t("Received at:")}</Text>
        <ValueText>{log.receivedAt.toLocaleString()}</ValueText>

        <Text>{t("Completed at:")}</Text>
        <ValueText>{log.completedAt.toLocaleString()}</ValueText>
      </Grid>
    </InfoTip>
  );
}
