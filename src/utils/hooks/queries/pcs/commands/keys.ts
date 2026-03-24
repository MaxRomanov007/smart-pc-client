import { pcsQueryKeys } from "@/utils/hooks/queries/pcs";

export abstract class pcCommandsQueryKeys extends pcsQueryKeys {
  static pcCommands(pcId: string) {
    return [...this.idPc(pcId), "commands"];
  }

  static pcCommand(pcId: string, commandId: string) {
    return [...this.pcCommands(pcId), commandId];
  }
}
