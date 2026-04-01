import { Button, Card } from "@chakra-ui/react";
import type { IAgentCommand } from "@/types/agent";

interface Props {
  command: IAgentCommand;
}

export function AgentCommand({ command }: Props) {
  return (
    <Card.Root variant="elevated">
      <Card.Header truncate>{command.name}</Card.Header>
      <Card.Body>
        <Card.Description lineClamp={3}>{command.description}</Card.Description>
      </Card.Body>
      <Card.Footer justifyContent="end">
        <Button>Hello</Button>
      </Card.Footer>
    </Card.Root>
  );
}
