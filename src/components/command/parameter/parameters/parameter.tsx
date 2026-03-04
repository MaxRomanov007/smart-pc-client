import {
  type CommandParameter,
  ParameterTypes,
} from "@/types/pc/command-parameter";
import { BooleanParameter } from "@/components/command/parameter/parameters/boolean-parameter";
import { NumberParameter } from "@/components/command/parameter/parameters/number-parameter";
import { StringParameter } from "@/components/command/parameter/parameters/string-parameter";

interface Props {
  parameter: CommandParameter;
  onParameterChange?: (value: CommandParameter) => void;
}

export function Parameter({ parameter, onParameterChange }: Props) {
  switch (parameter.type) {
    case ParameterTypes.boolean:
      return (
        <BooleanParameter
          parameter={parameter}
          onValueChange={(v) => onParameterChange?.({ ...parameter, value: v })}
        />
      );
    case ParameterTypes.number:
      return (
        <NumberParameter
          parameter={parameter}
          onValueChange={(v) => onParameterChange?.({ ...parameter, value: v })}
        />
      );
    case ParameterTypes.string:
      return (
        <StringParameter
          parameter={parameter}
          onValueChange={(v) => onParameterChange?.({ ...parameter, value: v })}
        />
      );
  }
}
