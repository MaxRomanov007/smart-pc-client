import type {
  IMessage,
  IMessagePayload,
  MessageTypes,
} from "@/@types/websocket/base";
import type { IPcStateData } from "@/@types/websocket/pc-state";
import type { IPcStatusData } from "@/@types/websocket/pc-status";

export type WebsocketMessage =
  | IMessage<IMessagePayload<typeof MessageTypes.pcStatus, IPcStatusData>>
  | IMessage<IMessagePayload<typeof MessageTypes.pcState, IPcStateData>>;

export { MessageTypes } from "@/@types/websocket/base";
