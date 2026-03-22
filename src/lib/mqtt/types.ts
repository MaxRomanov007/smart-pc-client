import {
  type IClientOptions,
  type IClientSubscribeOptions,
  type MqttClient,
} from "mqtt";
import type { ReactNode } from "react";
import type { IUser } from "@/types/auth/user";

export type MQTTConnectionStatus =
  | "offline"
  | "connecting"
  | "connected"
  | "error";

export interface MQTTError {
  name: string;
  message: string;
  stack?: string;
}

export interface MQTTMessage<P = string | Buffer> {
  topic: string;
  payload: P;
  qos?: 0 | 1 | 2;
  retain?: boolean;
}

export interface IMqttContext {
  status: MQTTConnectionStatus;
  error?: MQTTError;
  getClient: () => MqttClient | null;
  user: IUser | null;
  publish: (message: MQTTMessage) => Promise<void>;
  subscribe: (topic: string, options?: IClientSubscribeOptions) => () => void;
  disconnect: () => void;
}

export interface MQTTProviderProps {
  children: ReactNode;
  brokerUrl: string;
  wsPath?: string;
  options?: Omit<IClientOptions, "username" | "password">;
}