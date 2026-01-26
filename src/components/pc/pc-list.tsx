import { For, Grid } from "@chakra-ui/react";
import type { IPcItem } from "@/@types/pc/pc";
import PcCard from "@/components/pc/pc-card";

interface Props {
  pcs: IPcItem[];
}

export default function PcListBase({ pcs }: Props) {
  return (
    <Grid
      templateColumns={["1fr", "repeat(auto-fill, minmax(360px, 1fr))"]}
      gap={4}
    >
      <For each={pcs}>{(pc) => <PcCard pc={pc} />}</For>
    </Grid>
  );
}