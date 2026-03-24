import { type ICommandParameter } from "@/types/pc/command-parameter";
import ParameterBase from "@/components/command/parameter/parameters/parameter-base";
import { NumberInput } from "@chakra-ui/react";

interface Props {
  parameter: ICommandParameter<number>;
  onValueChange?: (value: number) => void;
}

export function NumberParameter({ parameter, onValueChange }: Props) {
  return (
    <ParameterBase parameter={parameter}>
      <NumberInput.Root
        w="full"
        value={parameter.value?.toString()}
        onValueChange={(e) => onValueChange?.(e.valueAsNumber)}
      >
        <NumberInput.Control />
        <NumberInput.Input placeholder={parameter.name} />
      </NumberInput.Root>
    </ParameterBase>
  );
}
