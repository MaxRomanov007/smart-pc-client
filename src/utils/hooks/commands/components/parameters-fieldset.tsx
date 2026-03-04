import { Fieldset } from "@chakra-ui/react";
import type { CommandParameter } from "@/types/pc/command-parameter";
import CommandParameters from "@/components/command/parameter/command-parameters";

interface Props {
  parameters: CommandParameter[];
  onParameterChange?: (parameter: CommandParameter) => void;
  text?: string;
}

export default function ParametersFieldset({
  parameters,
  onParameterChange,
  text,
}: Props) {
  return (
    <Fieldset.Root>
      {text && <Fieldset.HelperText>{text}</Fieldset.HelperText>}

      <CommandParameters
        parameters={parameters}
        onParameterChange={onParameterChange}
      />
    </Fieldset.Root>
  );
}
