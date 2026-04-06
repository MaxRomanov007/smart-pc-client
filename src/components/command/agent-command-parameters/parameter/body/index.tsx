import type { IAgentCommandParameter } from "@/types/agent";
import { Field, Input, Textarea, VStack } from "@chakra-ui/react";
import { useExtracted } from "next-intl";
import TypeSelect from "@/components/command/agent-command-parameters/parameter/type-select";
import { type FocusEventHandler, useState } from "react";

export type Errors = Partial<Record<"name" | "description", string>>;

interface Props {
  parameter: IAgentCommandParameter;
  onParameterChange?: (parameter: IAgentCommandParameter) => void;
  errors?: Errors;
}

export default function Body({ parameter, onParameterChange, errors }: Props) {
  const t = useExtracted("agent-command-parameter-body");

  const [name, setName] = useState<string>(parameter.name);
  const [description, setDescription] = useState<string>(parameter.description);

  const onNameChange: FocusEventHandler<HTMLInputElement> = (e) => {
    onParameterChange?.({ ...parameter, name: e.target.value });
  };
  const onDescriptionChange: FocusEventHandler<HTMLTextAreaElement> = (e) => {
    onParameterChange?.({ ...parameter, description: e.target.value });
  };

  return (
    <VStack gap={4} css={{ "--field-label-width": "96px" }}>
      <Field.Root invalid={!!errors?.name}>
        <Field.Label>
          {t({
            message: "Name",
            description: "name field",
          })}
        </Field.Label>

        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={onNameChange}
        />

        {!!errors?.name && <Field.ErrorText>{errors.name}</Field.ErrorText>}
      </Field.Root>

      <Field.Root invalid={!!errors?.description}>
        <Field.Label>
          {t({
            message: "Description",
            description: "description field",
          })}
        </Field.Label>

        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onBlur={onDescriptionChange}
          minH="5lh"
          maxH="5lh"
          autoresize
        />

        {!!errors?.description && (
          <Field.ErrorText>{errors.description}</Field.ErrorText>
        )}
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
