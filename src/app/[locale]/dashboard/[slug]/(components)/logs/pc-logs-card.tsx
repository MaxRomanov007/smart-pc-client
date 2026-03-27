"use client";

import { useExtracted } from "next-intl";
import { Card } from "@chakra-ui/react";
import type { IPc } from "@/types/pc/pc";
import type { ComponentProps } from "react";
import { PcLogsVirtualList } from "@/components/pc/log";

interface Props extends ComponentProps<typeof Card.Root> {
  pc: IPc;
}

export default function PcLogsCard({ pc, ...rest }: Props) {
  const t = useExtracted("pc-logs-card");

  return (
    <Card.Root {...rest}>
      <Card.Header flexShrink={0}>
        <Card.Title>
          {t({ message: "PC Logs", description: "card title" })}
        </Card.Title>
        <Card.Description>
          {t({
            message: "History of operations on PC {name}",
            values: { name: pc.name },
            description: "card description",
          })}
        </Card.Description>
      </Card.Header>

      <Card.Body flexGrow={1} overflow="hidden">
        <PcLogsVirtualList pcId={pc.id} />
      </Card.Body>

      <Card.Footer flexShrink={0} />
    </Card.Root>
  );
}
