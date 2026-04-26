export abstract class agentQueryKeys {
  static index = ["agent"];

  static commands = [...this.index, "commands"];

  static pcId = [...this.index, "pcId"];
}

export abstract class agentMutationKeys {
  static index = ["agent", "commands"];

  static currentCommand(commandId: string) {
    return [...this.index, commandId];
  }

  static createCommand() {
    return [...this.index, "create"];
  }

  static deleteThisPc() {
    return [...this.index, "delete-this-pc"];
  }

  static deleteCommand(commandId: string) {
    return [...this.currentCommand(commandId), "delete"];
  }

  static editCommand(commandId: string) {
    return [...this.currentCommand(commandId), "edit"];
  }
}
