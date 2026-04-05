import type { ParameterTypes } from "@/types/pc/command-parameter";

export interface IAgentCommandParameter<
  T extends ParameterTypes = ParameterTypes,
> {
  id: string;
  name: string;
  description: string;
  type: T;
}
