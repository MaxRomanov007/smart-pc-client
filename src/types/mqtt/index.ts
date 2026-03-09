import type { IMqttMessage, MqttMessageTypes } from "@/types/mqtt/base";

export type MqttMessage =
  | IMqttMessage<MqttMessageTypes.pcStatus>
  | IMqttMessage<MqttMessageTypes.pcState>
  | IMqttMessage<MqttMessageTypes.command>
  | IMqttMessage<MqttMessageTypes.wakerCommand>;

export { MqttMessageTypes } from "@/types/mqtt/base";
export type { IMqttMessage } from "@/types/mqtt/base";
