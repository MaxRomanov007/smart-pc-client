import ParameterBase from "@/components/command/parameter/parameters/parameter-base";
import { CheckboxCard } from "@chakra-ui/react";
import type { ICommandParameter } from "@/types/pc/command-parameter";

interface Props {
  parameter: ICommandParameter<boolean>;
  onValueChange?: (checked: boolean) => void;
}

export function BooleanParameter({ parameter, onValueChange }: Props) {
  return (
    <ParameterBase parameter={parameter}>
      <CheckboxCard.Root
        size="sm"
        w="full"
        variant="surface"
        checked={parameter.value}
        onCheckedChange={(e) => onValueChange?.(!!e.checked)}
      >
        <CheckboxCard.HiddenInput />
        <CheckboxCard.Control>
          <CheckboxCard.Content>
            <CheckboxCard.Label>{parameter.name}</CheckboxCard.Label>
          </CheckboxCard.Content>
          <CheckboxCard.Indicator alignSelf="center" />
        </CheckboxCard.Control>
      </CheckboxCard.Root>
    </ParameterBase>
  );
}
