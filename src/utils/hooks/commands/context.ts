import { createContext } from "react";
import type { ICommandsContext } from "@/utils/hooks/commands/types";

export const CommandsContext = createContext<ICommandsContext | undefined>(
  undefined,
);
CommandsContext.displayName = "CommandsContext";
