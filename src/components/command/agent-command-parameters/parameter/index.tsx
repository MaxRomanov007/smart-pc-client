import type { IAgentCommandParameter } from "@/types/agent";
import { Card } from "@chakra-ui/react";
import Body from "./body";

interface Props {
  parameter: IAgentCommandParameter;
  onParameterChange?: (parameter: IAgentCommandParameter) => void;
}

export default function AgentCommandParameter({
  parameter,
  onParameterChange,
}: Props) {
  return (
    <Card.Root>
      <Card.Body>
        <Body parameter={parameter} onParameterChange={onParameterChange} />
      </Card.Body>
    </Card.Root>
  );
}
