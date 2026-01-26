export const MessageTypes = {
  pcStatus: "pc-status",
  pcState: "pc-state",
} as const;

type MessageType = (typeof MessageTypes)[keyof typeof MessageTypes];

export interface IMessagePayload<
  T extends MessageType = MessageType,
  D = unknown,
> {
  type: T;
  data: D;
}

export interface IMessage<T extends IMessagePayload> {
  duplicate: boolean;
  qos: number;
  retained: boolean;
  Topic: string;
  message_id: number;
  payload: T;
}