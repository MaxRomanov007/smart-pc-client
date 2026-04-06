import { Float, HStack, IconButton, ScrollArea } from "@chakra-ui/react";
import AgentCommandParametersList, {
  type ErrorsFunction,
  type ParameterDeleteHandler,
} from "@/components/command/agent-command-parameters";
import type { IAgentCommandParameter } from "@/types/agent";
import { LuPlus } from "react-icons/lu";
import { useCallback } from "react";
import { ParameterTypes } from "@/types/pc/command-parameter";
import { useExtracted } from "next-intl";

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
      <ScrollArea.Viewport>
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
        <IconButton size="xs" variant="outline" onClick={addParameter}>
          <LuPlus />
        </IconButton>
      </Float>
      <ScrollArea.Scrollbar orientation="horizontal" />
      <ScrollArea.Corner />
    </ScrollArea.Root>
  );
}
