export enum PcLogStatus {
  ok = "ok",
  commandError = "command-error",
  internalError = "internal-error",
}

export interface IPcLog {
  id: string;
  commandId: string;
  commandName?: string;
  receivedAt: Date;
  completedAt: Date;
  status: PcLogStatus;
  error?: string;
}
