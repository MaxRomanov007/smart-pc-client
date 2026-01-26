import { For } from "@chakra-ui/react";
import type { IPcItem } from "@/@types/pc/pc";
import PcCard from "@/components/pc/pc-card";
import PcListGrid from "@/components/pc/pc-list-grid";
import PcListEmptyState from "@/components/pc/pc-list-empty-state";

interface Props {
  pcs: IPcItem[];
}

export default function PcList({ pcs }: Props) {
  return (
    <PcListGrid empty={pcs.length === 0}>
      <For each={pcs} fallback={<PcListEmptyState />}>
        {(pc) => <PcCard pc={pc} />}
      </For>
    </PcListGrid>
  );
}
