import type { IPcStatusData } from "@/types/mqtt/pc-status";
import type { IPcStateData } from "@/types/mqtt/pc-state";
import type { ICommandData } from "@/types/mqtt/command";

export enum MqttMessageTypes {
  pcStatus = "pc-status",
  pcState = "pc-state",
  command = "command",
  wakerCommand = "waker-command",
}

type MessageTypeDataMap = {
  [MqttMessageTypes.pcStatus]: IPcStatusData;
  [MqttMessageTypes.pcState]: IPcStateData;
  [MqttMessageTypes.command]: ICommandData;
  [MqttMessageTypes.wakerCommand]: ICommandData;
};

export interface IMqttMessage<T extends MqttMessageTypes = MqttMessageTypes> {
  type: T;
  data: MessageTypeDataMap[T];
}