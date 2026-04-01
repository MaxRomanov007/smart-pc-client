"use client";

import { useExtracted } from "next-intl";
import { Card, Grid, ScrollArea } from "@chakra-ui/react";
import type { ComponentProps } from "react";
import { useAgentCommands } from "@/utils/hooks/queries/agent";
import { AgentCommandsList } from "@/components/command/agent-commands-list";

type Props = ComponentProps<typeof Card.Root>;

export default function PcAgentCommandsCard({ ...rest }: Props) {
  const t = useExtracted("agent-commands-card");

  const { data, isError } = useAgentCommands();

  if (isError || !data) return null;

  return (
    <Card.Root {...rest}>
      <Card.Header flexShrink={0}>
        <Card.Title>
          {t({ message: "PC Commands", description: "card title" })}
        </Card.Title>
        <Card.Description>
          {t({
            message: "Commands registered on your PC",
            description: "card description",
          })}
        </Card.Description>
      </Card.Header>

      <Card.Body flexGrow={1} overflow="hidden">
        <ScrollArea.Root>
          <ScrollArea.Viewport>
            <ScrollArea.Content>
              <Grid gap={4} templateColumns="repeat(2, 1fr)">
                <AgentCommandsList commands={data} />
              </Grid>
            </ScrollArea.Content>
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar />
        </ScrollArea.Root>
      </Card.Body>

      <Card.Footer flexShrink={0} />
    </Card.Root>
  );
}
