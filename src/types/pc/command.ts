import type { IAgentCommandParameter } from "@/types/agent/command-parameter";

export interface ICommand {
  id: string;
  name: string;
  description: string;
  parameters: IAgentCommandParameter[];
}
