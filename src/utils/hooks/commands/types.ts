import type { UseConfirmationDialogType } from "@/utils/hooks/ui/dialogs/confirmation/useConfirmationDialog";
import type { CommandParameter } from "@/types/pc/command-parameter";
import type { IPc } from "@/types/pc/pc";
import { MessageTypes } from "@/types/mqtt";

export type DoCommandMessageType = MessageTypes.command | MessageTypes.wakerCommand;

export interface DoCommandOptions {
  pc: IPc;
  name: string;
  params?: CommandParameter[];
  commandType?: DoCommandMessageType;
  dialogTitle?: string;
  text?: string;
  withoutDialog?: boolean;
}

export type DoCommandFunction = (options: DoCommandOptions) => Promise<void>;

export interface ICommandsContext {
  dialog: UseConfirmationDialogType;
  doCommand: DoCommandFunction;
}
