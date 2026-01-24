import { type IMessage, MessageTypes } from "@/@types/websocket/base";

export const PcStatuses = {
  online: "online",
  offline: "offline",
} as const

type PcStatusType = typeof PcStatuses[keyof typeof PcStatuses]

interface IPcStatusMessageData {
  status: PcStatusType;
}

export interface IPcStatusMessage extends IMessage<typeof MessageTypes.pcStatus> {
  data: IPcStatusMessageData;
}