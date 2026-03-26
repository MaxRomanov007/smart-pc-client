import { pcsQueryKeys } from "@/utils/hooks/queries/pcs";

export abstract class pcLogsQueryKeys extends pcsQueryKeys {
  static pcLogs(pcId: string) {
    return [...this.idPc(pcId), "logs"];
  }
}
