import { pcCommandsQueryKeys } from "@/utils/hooks/queries/pcs/commands";

export abstract class pcCommandParametersQueryKeys extends pcCommandsQueryKeys {
  static pcCommandParameters(pcId: string, commandId: string) {
    return [...this.pcCommand(pcId, commandId), "parameters"];
  }
}
