import { pcsQueryKeys } from "@/utils/hooks/queries/pcs";

export abstract class pcCommandsQueryKeys extends pcsQueryKeys {
  static pcCommand(pcId: string) {
    return [...this.idPc(pcId), "commands"];
  }
}
