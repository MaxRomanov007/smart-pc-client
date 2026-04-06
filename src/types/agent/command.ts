import type { IAgentCommandParameter } from "@/types/agent/command-parameter";

export interface IAgentCommand {
  id: string;
  name: string;
  description: string;
  script: string;
  parameters: IAgentCommandParameter[];
}
