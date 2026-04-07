export abstract class agentQueryKeys {
  static index = ["agent"];

  static commands = [...this.index, "commands"];
}

export abstract class agentMutationKeys {
  static index = ["agent", "commands"];

  static currentCommand(commandId: string) {
    return [...this.index, commandId];
  }

  static createCommand() {
    return [...this.index, "create"];
  }

  static deleteCommand(commandId: string) {
    return [...this.currentCommand(commandId), "delete"];
  }

  static editCommand(commandId: string) {
    return [...this.currentCommand(commandId), "edit"];
  }
}
