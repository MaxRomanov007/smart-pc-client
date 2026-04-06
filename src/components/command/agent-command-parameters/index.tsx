import { For } from "@chakra-ui/react";
import type { IAgentCommandParameter } from "@/types/agent";
import AgentCommandParameter from "./parameter";
import { type Errors } from "./parameter/body";

export type ParametersChangeHandler = (
  parameters: IAgentCommandParameter[],
) => void;
export type ParameterDeleteHandler = (
  parameters: IAgentCommandParameter,
) => void;
export type ErrorsFunction = (parameter: IAgentCommandParameter) => Errors;

interface Props {
  parameters?: IAgentCommandParameter[];
  onParametersChange?: ParametersChangeHandler;
  onDeleteParameter?: ParameterDeleteHandler;
  errors?: ErrorsFunction;
}

export default function AgentCommandParametersList({
  parameters,
  onParametersChange,
  onDeleteParameter,
  errors,
}: Props) {
  return (
    <For each={parameters}>
      {(parameter) => (
        <AgentCommandParameter
          key={parameter.id}
          w={500}
          parameter={parameter}
          onParameterChange={(parameter) =>
            onParametersChange?.(
              parameters?.map((param) =>
                param.id === parameter.id ? parameter : param,
              ) ?? [],
            )
          }
          onDelete={onDeleteParameter}
          errors={errors?.(parameter)}
        />
      )}
    </For>
  );
}
