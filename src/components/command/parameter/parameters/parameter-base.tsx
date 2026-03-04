import type { CommandParameter } from "@/types/pc/command-parameter";
import type { ReactNode } from "react";
import { Field, HStack, Text } from "@chakra-ui/react";
import { InfoTip } from "@/components/ui/chakra/toggle-tip";

interface Props {
  parameter: CommandParameter;
  children?: ReactNode;
}

function ParameterBase({ parameter, children }: Props) {
  return (
    <Field.Root>
      <Field.Label>
        <HStack alignContent="center">
          <Text>{parameter.name}</Text>
          <InfoTip>{parameter.description}</InfoTip>
        </HStack>
      </Field.Label>
      {children}
    </Field.Root>
  );
}

export default ParameterBase;
