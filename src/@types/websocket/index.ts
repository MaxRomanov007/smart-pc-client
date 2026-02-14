import type { IMessage, MessageTypes } from "@/@types/websocket/base";
import type { IPcStateData } from "@/@types/websocket/pc-state";
import type { IPcStatusData } from "@/@types/websocket/pc-status";

export type WebsocketMessage =
  | IMessage<typeof MessageTypes.pcStatus, IPcStatusData>
  | IMessage<typeof MessageTypes.pcState, IPcStateData>;

export { MessageTypes } from "@/@types/websocket/base";
