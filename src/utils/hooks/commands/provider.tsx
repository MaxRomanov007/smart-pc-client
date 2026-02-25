import { useMqttJsonPublish } from "@/lib/mqtt/hooks/use-mqtt-json-publish";
import { useConfirmationDialog } from "@/utils/hooks/ui/dialogs/confirmation/useConfirmationDialog";
import { CommandsContext } from "@/utils/hooks/commands/context";
import type { DoCommandFunction } from "@/utils/hooks/commands/types";
import type { CommandParameter } from "@/types/pc/command-parameter";
import { type ReactNode, useCallback } from "react";
import type { IPc } from "@/types/pc/pc";
import type { MQTTMessage } from "@/lib/mqtt/types";
import { MessageTypes, type MqttMessage } from "@/types/mqtt";
import { useExtracted } from "next-intl";
import ConfirmationDialogWithStore from "@/components/ui/dialog/confirmation-dialog/with-store";

export function CommandsProvider({ children }: { children: ReactNode }) {
  const { publish, isConnected } = useMqttJsonPublish();
  const dialog = useConfirmationDialog();
  const t = useExtracted("commands-provider");

  const doCommand: DoCommandFunction = useCallback(
    async (
      pc: IPc,
      name: string,
      params: CommandParameter[] = [],
      commandType:
        | MessageTypes.command
        | MessageTypes.wakerCommand = MessageTypes.command,
      dialogTitle: string = t({
        message: "Are you sure?",
        description: "default confirmation dialog title",
      }),
      dialogText: string = t({
        message: "Are you sure you want to execute command {name}",
        values: {
          name,
        },
        description: "default confirmation dialog text",
      }),
    ) => {
      if (!isConnected) {
        return;
      }

      const parameter = new Map<string, string>();
      params?.forEach((param) =>
        parameter.set(param.name, param.value.toString()),
      );

      const message: MQTTMessage<MqttMessage> = {
        topic: `pcs/${pc.id}/command`,
        payload: {
          type: commandType,
          data: {
            command: name,
            parameter,
          },
        },
        qos: 1,
      };

      dialog.show(dialogTitle, dialogText, async () => {
        await publish(message);
      });
    },
    [dialog, isConnected, publish, t],
  );

  return (
    <CommandsContext.Provider value={{ dialog, doCommand }}>
      {children}
      <ConfirmationDialogWithStore store={dialog} />
    </CommandsContext.Provider>
  );
}
