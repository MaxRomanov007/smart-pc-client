import type { IMessage, MessageTypes } from "@/types/mqtt/base";
import type { IPcStateData } from "@/types/mqtt/pc-state";
import type { IPcStatusData } from "@/types/mqtt/pc-status";

export type MqttMessage =
  | IMessage<typeof MessageTypes.pcStatus, IPcStatusData>
  | IMessage<typeof MessageTypes.pcState, IPcStateData>;

export { MessageTypes } from "@/types/mqtt/base";
