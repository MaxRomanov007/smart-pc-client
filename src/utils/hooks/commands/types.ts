import type { UseConfirmationDialogType } from "@/utils/hooks/ui/dialogs/confirmation/useConfirmationDialog";
import type { CommandParameter } from "@/types/pc/command-parameter";
import type { IPc } from "@/types/pc/pc";
import { MessageTypes } from "@/types/mqtt";

export interface DoCommandOptions {
  pc: IPc;
  name: string;
  params?: CommandParameter[];
  commandType?: MessageTypes.command | MessageTypes.wakerCommand;
  dialogTitle?: string;
  dialogText?: string;
}

export type DoCommandFunction = (options: DoCommandOptions) => Promise<void>;

export interface ICommandsContext {
  dialog: UseConfirmationDialogType;
  doCommand: DoCommandFunction;
}
