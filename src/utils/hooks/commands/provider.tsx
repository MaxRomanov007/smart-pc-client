"use client";

import { useMqttJsonPublish } from "@/lib/mqtt/hooks/use-mqtt-json-publish";
import { useConfirmationDialog } from "@/utils/hooks/ui/dialogs/confirmation/useConfirmationDialog";
import { CommandsContext } from "@/utils/hooks/commands/context";
import type {
  DoCommandFunction,
  DoCommandOptions,
} from "@/utils/hooks/commands/types";
import type { CommandParameter } from "@/types/pc/command-parameter";
import { type ReactNode, useCallback, useRef } from "react";
import type { MQTTMessage } from "@/lib/mqtt/types";
import { MessageTypes, type MqttMessage } from "@/types/mqtt";
import { useExtracted } from "next-intl";
import ConfirmationDialogWithStore from "@/components/ui/dialog/confirmation-dialog/with-store";
import { ParametersFieldsetStateful } from "@/utils/hooks/commands/components/parameters-fieldset-stateful";

export function CommandsProvider({ children }: { children: ReactNode }) {
  const { publish, isConnected } = useMqttJsonPublish();
  const dialog = useConfirmationDialog();
  const t = useExtracted("commands-provider");
  const parametersRef = useRef<CommandParameter[]>([]);

  const doCommand: DoCommandFunction = useCallback(
    async ({
      pc,
      name,
      params = [],
      commandType = MessageTypes.command,
      dialogTitle = t({
        message: "Are you sure?",
        description: "default confirmation dialog title",
      }),
      dialogText = t({
        message: "Are you sure you want to execute command {name}",
        values: { name },
        description: "default confirmation dialog text",
      }),
    }: DoCommandOptions) => {
      if (!isConnected) return;

      parametersRef.current = params;

      dialog.show(
        dialogTitle,
        <ParametersFieldsetStateful
          initialParameters={params}
          text={dialogText}
          parametersRef={parametersRef}
        />,
        async () => {
          const parameter = new Map<string, string>();

          parametersRef.current.forEach((param) =>
            parameter.set(param.name, param.value.toString()),
          );

          const message: MQTTMessage<MqttMessage> = {
            topic: `pcs/${pc.id}/command`,
            payload: {
              type: commandType,
              data: { command: name, parameter },
            },
            qos: 1,
          };

          await publish(message);
        },
      );
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
