import type { CommandParameter } from "@/types/pc/command-parameter";

export interface ICommand {
  command: string;
  parameters?: CommandParameter[];
  parameter?: Map<string, string>;
}
