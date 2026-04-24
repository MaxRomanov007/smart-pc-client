import { Float, HStack, ScrollArea } from "@chakra-ui/react";
import AgentCommandParametersList, {
  type ErrorsFunction,
  type ParameterDeleteHandler,
} from "@/components/command/agent-command-parameters";
import type { IAgentCommandParameter } from "@/types/agent";
import { useCallback } from "react";
import { ParameterTypes } from "@/types/pc/command-parameter";
import { useExtracted } from "next-intl";
import AddButton from "@/components/button/add-button";

interface Props {
  parameters?: IAgentCommandParameter[];
  onParametersChange?: (parameters: IAgentCommandParameter[]) => void;
}

export default function ParametersEdit({
  parameters,
  onParametersChange,
}: Props) {
  const t = useExtracted("agent-commands-parameters-edit");

  const addParameter = useCallback(() => {
    onParametersChange?.([
      ...(parameters ?? []),
      {
        type: ParameterTypes.string,
        description: "",
        name: "",
        id: crypto.randomUUID(),
      },
    ]);
  }, [onParametersChange, parameters]);

  const calculateErrors = useCallback<ErrorsFunction>(
    (parameter) => ({
      name: parameters?.some(
        (param) => param.name === parameter.name && param.id !== parameter.id,
      )
        ? t({
            message: "A parameter with this name already exists",
            description: "error message on same name is exists",
          })
        : undefined,
    }),
    [parameters, t],
  );

  const deleteParam: ParameterDeleteHandler = (parameter) =>
    onParametersChange?.(
      parameters?.filter((param) => param.id !== parameter.id) ?? [],
    );

  return (
    <ScrollArea.Root>
      <ScrollArea.Viewport minH={12}>
        <ScrollArea.Content>
          <HStack alignItems="stretch" mb={4}>
            <AgentCommandParametersList
              parameters={parameters}
              onParametersChange={onParametersChange}
              onDeleteParameter={deleteParam}
              errors={calculateErrors}
            />
          </HStack>
        </ScrollArea.Content>
      </ScrollArea.Viewport>
      <Float placement="bottom-end" offset={7}>
        <AddButton size="xs" variant="outline" onClick={addParameter} />
      </Float>
      <ScrollArea.Scrollbar orientation="horizontal" />
      <ScrollArea.Corner />
    </ScrollArea.Root>
  );
}
