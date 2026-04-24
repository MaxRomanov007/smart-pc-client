import type { ICommand } from "@/types/pc/command";

export enum PcLogStatus {
  ok = "ok",
  commandError = "command-error",
  internalError = "internal-error",
}

export interface IPcLog {
  id: string;
  commandId: string;
  receivedAt: Date;
  completedAt: Date;
  status: PcLogStatus;
  error?: string;

  command?: ICommand;
}
