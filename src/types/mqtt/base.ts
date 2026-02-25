export enum MessageTypes {
  pcStatus = "pc-status",
  pcState = "pc-state",
  command = "command",
  wakerCommand = "waker-command",
}

export interface IMessage<T extends MessageTypes = MessageTypes, D = unknown> {
  type: T;
  data: D;
}