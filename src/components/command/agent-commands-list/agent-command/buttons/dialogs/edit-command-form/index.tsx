import type { AgentCommandToEdit } from "@/services/agent";
import { Field, VStack } from "@chakra-ui/react";
import { useExtracted } from "next-intl";
import Editable from "@/components/ui/editable";

interface Props {
  command: AgentCommandToEdit;
  onCommandUpdate: (newCommand: AgentCommandToEdit) => void;
}

export default function EditCommandForm({ command, onCommandUpdate }: Props) {
  const t = useExtracted("agent-command-edit-dialog-form");

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
          value={command.name}
          onValueChange={(name) => onCommandUpdate({ ...command, name })}
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
          value={command.description}
          onValueChange={(description) =>
            onCommandUpdate({ ...command, description })
          }
        />
      </Field.Root>
    </VStack>
  );
}
