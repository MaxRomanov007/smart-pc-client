"use client";

import { type CommandParameter } from "@/types/pc/command-parameter";
import { Parameter } from "@/components/command/commands-list/parameter/parameters/parameter";

interface Props {
  parameters: CommandParameter[];
  onParameterChange?: (parameter: CommandParameter) => void;
}

export default function CommandParameters({
  parameters,
  onParameterChange,
}: Props) {
  return parameters.map((param) => (
    <Parameter
      key={param.id}
      parameter={param}
      onParameterChange={onParameterChange}
    />
  ));
}
