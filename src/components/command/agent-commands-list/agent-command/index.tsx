import { Card } from "@chakra-ui/react";
import type { IAgentCommand } from "@/types/agent";
import { DeleteButton, EditButton } from "./buttons";

interface Props {
  command: IAgentCommand;
}

export default function AgentCommand({ command }: Props) {
  return (
    <Card.Root>
      <Card.Header>
        <Card.Title truncate>{command.name}</Card.Title>
      </Card.Header>
      <Card.Body>
        <Card.Description lineClamp={3}>{command.description}</Card.Description>
      </Card.Body>
      <Card.Footer justifyContent="space-between">
        <DeleteButton command={command} />
        <EditButton command={command} />
      </Card.Footer>
    </Card.Root>
  );
}
