"use client";

import { useMqttJsonPublish } from "@/lib/mqtt/hooks/use-mqtt-json-publish";
import { useConfirmationDialog } from "@/utils/hooks/ui/dialogs/confirmation/useConfirmationDialog";
import { CommandsContext } from "@/utils/hooks/commands/context";
import type {
  DoCommandFunction,
  DoCommandMessageType,
  DoCommandOptions,
} from "@/utils/hooks/commands/types";
import type { CommandParameter } from "@/types/pc/command-parameter";
import { type ReactNode, useCallback, useRef } from "react";
import type { MQTTMessage } from "@/lib/mqtt/types";
import { type MqttMessage, MqttMessageTypes } from "@/types/mqtt";
import { useExtracted } from "next-intl";
import ConfirmationDialogWithStore from "@/components/ui/dialog/confirmation-dialog/with-store";
import { ParametersFieldsetStateful } from "@/utils/hooks/commands/components/parameters-fieldset-stateful";
import type { IPc } from "@/types/pc/pc";

export function CommandsProvider({ children }: { children: ReactNode }) {
  const { publish, isConnected } = useMqttJsonPublish();
  const dialog = useConfirmationDialog();
  const t = useExtracted("commands-provider");
  const parametersRef = useRef<CommandParameter[]>([]);

  const publishMessage = useCallback(
    async (pc: IPc, name: string, type: DoCommandMessageType) => {
      const parameter = new Map<string, string>();

      parametersRef.current.forEach((param) =>
        parameter.set(param.name, param.value.toString()),
      );

      const message: MQTTMessage<MqttMessage> = {
        topic: `pcs/${pc.id}/command`,
        payload: {
          type: type,
          data: { command: name, parameter },
        },
        qos: 1,
      };

      await publish(message);
    },
    [publish],
  );

  const doCommand: DoCommandFunction = useCallback(
    async ({
      pc,
      name,
      params = [],
      messageType = MqttMessageTypes.command,
      dialogTitle = t({
        message: "Are you sure?",
        description: "default confirmation dialog title",
      }),
      text = t({
        message: "Are you sure you want to execute command {name}",
        values: { name },
        description: "default confirmation dialog text",
      }),
      withoutDialog = false,
    }: DoCommandOptions) => {
      if (!isConnected) return;

      if (withoutDialog) {
        await publishMessage(pc, name, messageType);
        return;
      }

      parametersRef.current = params;

      dialog.show(
        dialogTitle,
        <ParametersFieldsetStateful
          initialParameters={params}
          text={text}
          parametersRef={parametersRef}
        />,
        async () => await publishMessage(pc, name, messageType),
      );
    },
    [dialog, isConnected, publishMessage, t],
  );

  return (
    <CommandsContext.Provider value={{ dialog, doCommand }}>
      {children}
      <ConfirmationDialogWithStore store={dialog} />
    </CommandsContext.Provider>
  );
}
