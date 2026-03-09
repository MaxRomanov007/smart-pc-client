import type { UseConfirmationDialogType } from "@/utils/hooks/ui/dialogs/confirmation/useConfirmationDialog";
import type { CommandParameter } from "@/types/pc/command-parameter";
import type { IPc } from "@/types/pc/pc";
import { MqttMessageTypes } from "@/types/mqtt";

export type DoCommandMessageType =
  | MqttMessageTypes.command
  | MqttMessageTypes.wakerCommand;

export interface DoCommandOptions {
  pc: IPc;
  name: string;
  params?: CommandParameter[];
  messageType?: DoCommandMessageType;
  dialogTitle?: string;
  text?: string;
  withoutDialog?: boolean;
}

export type DoCommandFunction = (options: DoCommandOptions) => Promise<void>;

export interface ICommandsContext {
  dialog: UseConfirmationDialogType;
  doCommand: DoCommandFunction;
}
