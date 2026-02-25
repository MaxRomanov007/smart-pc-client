import { useContext } from "react";
import { CommandsContext } from "@/utils/hooks/commands/context";

export function useCommands() {
  const context = useContext(CommandsContext);

  if (!context) {
    throw new Error("useCommands must be used within CommandsProvider");
  }

  return context;
}
