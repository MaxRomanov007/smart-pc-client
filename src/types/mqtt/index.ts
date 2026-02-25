import type { IMessage, MessageTypes } from "@/types/mqtt/base";
import type { IPcStateData } from "@/types/mqtt/pc-state";
import type { IPcStatusData } from "@/types/mqtt/pc-status";
import type { ICommandData } from "@/types/mqtt/command";

export type MqttMessage =
  | IMessage<typeof MessageTypes.pcStatus, IPcStatusData>
  | IMessage<typeof MessageTypes.pcState, IPcStateData>
  | IMessage<typeof MessageTypes.command, ICommandData>
  | IMessage<typeof MessageTypes.wakerCommand, ICommandData>;

export { MessageTypes } from "@/types/mqtt/base";
