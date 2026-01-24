export const MessageTypes = {
  pcStatus: "pc-status",
} as const;

type MessageType = (typeof MessageTypes)[keyof typeof MessageTypes];

export interface IMessage<T extends MessageType = MessageType> {
  type: T;
}