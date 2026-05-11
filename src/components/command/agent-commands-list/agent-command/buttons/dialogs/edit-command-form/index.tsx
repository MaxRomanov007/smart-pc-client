"use client";

import type { AgentCommandToEdit } from "@/services/agent";
import { Field, VStack } from "@chakra-ui/react";
import { useExtracted } from "next-intl";
import Editable from "@/components/ui/editable";
import CodeEditor from "@/components/code-editor";
import ParametersEdit from "@/components/command/agent-commands-list/agent-command/buttons/dialogs/edit-command-form/parameters-edit";

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
          maxLength={255}
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
          value={command.description}
          onValueChange={(description) =>
            onCommandUpdate({ ...command, description })
          }
          maxLength={1024}
        />
      </Field.Root>

      <Field.Root>
        <Field.Label>
          {t({
            message: "Parameters",
            description: "parameters field",
          })}
        </Field.Label>

        <ParametersEdit
          parameters={command.parameters}
          onParametersChange={(parameters) =>
            onCommandUpdate({ ...command, parameters })
          }
          maxItems={5}
        />
      </Field.Root>

      <Field.Root>
        <Field.Label>
          {t({
            message: "Script",
            description: "script field",
          })}
        </Field.Label>

        <CodeEditor
          value={command.script}
          onChange={(script) => onCommandUpdate({ ...command, script })}
          maxChars={8196}
          w="full"
          h={400}
        />
      </Field.Root>
    </VStack>
  );
}
