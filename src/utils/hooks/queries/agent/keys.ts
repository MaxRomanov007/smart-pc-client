export abstract class agentQueryKeys {
  static index = ["agent"];

  static commands = [...this.index, "commands"];
}

export abstract class agentMutationKeys {
  static deleteCommand(id: string) {
    return ["delete-command", id];
  }

  static editCommand(id: string) {
    return ["edit-command", id];
  }
}
