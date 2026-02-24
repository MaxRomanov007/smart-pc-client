import { createContext } from "react";
import type { IMqttContext } from "./types";

export const MqttContext = createContext<IMqttContext | undefined>(undefined);
MqttContext.displayName = "MqttContext";
