import { type ICommandParameter } from "@/types/pc/command-parameter";
import ParameterBase from "@/components/command/commands-list/parameter/parameters/parameter-base";
import { Input } from "@chakra-ui/react";

interface Props {
  parameter: ICommandParameter<string>;
  onValueChange?: (value: string) => void;
}

export function StringParameter({ parameter, onValueChange }: Props) {
  return (
    <ParameterBase parameter={parameter}>
      <Input
        placeholder={parameter.name}
        value={parameter.value}
        onChange={(e) => onValueChange?.(e.currentTarget.value)}
      />
    </ParameterBase>
  );
}
