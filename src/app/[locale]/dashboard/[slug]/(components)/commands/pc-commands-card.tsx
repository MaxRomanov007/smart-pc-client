"use client";

import { useExtracted } from "next-intl";
import { Card, ScrollArea } from "@chakra-ui/react";
import type { IPc } from "@/types/pc/pc";
import { usePcCommandsQuery } from "@/utils/hooks/queries/pcs/commands";
import { CommandsList } from "@/components/command/commands-list";
import type { ComponentProps } from "react";

interface Props extends ComponentProps<typeof Card.Root> {
  pc: IPc;
}

export default function PcCommandsCard({ pc, ...rest }: Props) {
  const t = useExtracted("pc-commands-card");

  const { data, isError } = usePcCommandsQuery(pc.id);

  if (isError || !data) return null;

  return (
    <Card.Root {...rest}>
      <Card.Header flexShrink={0}>
        <Card.Title>
          {t({ message: "PC Commands", description: "card title" })}
        </Card.Title>
        <Card.Description>
          {t({
            message: "Commands registered on PC {name}",
            values: { name: pc.name },
            description: "card description",
          })}
        </Card.Description>
      </Card.Header>

      <Card.Body flexGrow={1} overflow="hidden">
        <ScrollArea.Root>
          <ScrollArea.Viewport>
            <ScrollArea.Content p={1}>
              <CommandsList commands={data} pc={pc} />
            </ScrollArea.Content>
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar />
        </ScrollArea.Root>
      </Card.Body>

      <Card.Footer flexShrink={0} />
    </Card.Root>
  );
}
