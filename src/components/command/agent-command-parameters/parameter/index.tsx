import type { IAgentCommandParameter } from "@/types/agent";
import { Card, Float } from "@chakra-ui/react";
import Body, { type Errors } from "./body";
import type { ComponentProps } from "react";
import DeleteButton from "@/components/button/delete-button";

interface Props extends ComponentProps<typeof Card.Root> {
  parameter: IAgentCommandParameter;
  onParameterChange?: (parameter: IAgentCommandParameter) => void;
  onDelete?: (parameter: IAgentCommandParameter) => void;
  errors?: Errors;
}

export default function AgentCommandParameter({
  parameter,
  onParameterChange,
  onDelete,
  errors,
  ...props
}: Props) {
  return (
    <Card.Root {...props}>
      <Card.Body>
        <Body
          parameter={parameter}
          onParameterChange={onParameterChange}
          errors={errors}
        />
      </Card.Body>

      {onDelete && (
        <Float placement="top-end" offset={6}>
          <DeleteButton size="xs" onClick={() => onDelete?.(parameter)} />
        </Float>
      )}
    </Card.Root>
  );
}
