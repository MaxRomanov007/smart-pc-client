export const MessageTypes = {
  pcStatus: "pc-status",
  pcState: "pc-state",
} as const;

type MessageType = (typeof MessageTypes)[keyof typeof MessageTypes];

export interface IMessage<T extends MessageType = MessageType, D = unknown> {
  type: T;
  data: D;
}