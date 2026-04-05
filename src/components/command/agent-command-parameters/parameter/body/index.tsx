import type { IAgentCommandParameter } from "@/types/agent";
import { Field, VStack } from "@chakra-ui/react";
import Editable from "@/components/ui/editable";
import { useExtracted } from "next-intl";
import TypeSelect from "@/components/command/agent-command-parameters/parameter/type-select";

interface Props {
  parameter: IAgentCommandParameter;
  onParameterChange?: (parameter: IAgentCommandParameter) => void;
}

export default function Body({ parameter, onParameterChange }: Props) {
  const t = useExtracted("agent-command-parameter-body");

  return (
    <VStack gap={4} css={{ "--field-label-width": "96px" }}>
      <Field.Root orientation="horizontal">
        <Field.Label>
          {t({
            message: "Name",
            description: "name field",
          })}
        </Field.Label>

        <Editable
          value={parameter.name}
          onValueChange={(name) => onParameterChange?.({ ...parameter, name })}
        />
      </Field.Root>

      <Field.Root orientation="horizontal">
        <Field.Label>
          {t({
            message: "Description",
            description: "description field",
          })}
        </Field.Label>

        <Editable
          previewProps={{ lineClamp: 5, wordBreak: "break-word" }}
          textarea={{ autoresize: true, maxH: "5lh" }}
          value={parameter.description}
          onValueChange={(description) =>
            onParameterChange?.({ ...parameter, description })
          }
        />
      </Field.Root>

      <TypeSelect
        type={parameter.type}
        onTypeChange={(type) => onParameterChange?.({ ...parameter, type })}
        label={t({
          message: "Type",
          description: "type field label",
        })}
        placeholder={t({
          message: "Select parameter type",
          description: "type field placeholder",
        })}
      />
    </VStack>
  );
}
