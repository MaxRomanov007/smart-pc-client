"use client";

import { useExtracted } from "next-intl";
import { Card } from "@chakra-ui/react";
import type { IPc } from "@/types/pc/pc";
import { usePcCommandsQuery } from "@/utils/hooks/queries/pcs/commands";
import CommandsList from "@/components/command/commands-list";

interface Props {
  pc: IPc;
}

export default function PcCommandsCard({ pc }: Props) {
  const t = useExtracted("pc-commands-card");

  const { data, isError } = usePcCommandsQuery(pc.id);

  if (isError || !data) return null;

  return (
    <Card.Root h="full">
      <Card.Header>
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

      <Card.Body>
        <CommandsList commands={data} pc={pc} />
      </Card.Body>

      <Card.Footer />
    </Card.Root>
  );
}
