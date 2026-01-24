"use client"

import { For, Grid } from "@chakra-ui/react";
import type { IPc } from "@/@types/pc/pc";
import PcCard from "@/components/pc/pc-card";
import { useToken } from "@/contexts/token";

interface Props {
  pcs: IPc[]
}

export default function PcList({pcs}: Props) {
  const {token, loading} = useToken()

  if (!token || loading) return null

  return (
    <Grid
      templateColumns={[
        "1fr",
        "repeat(auto-fill, minmax(360px, 1fr))",
      ]}
      gap={4}
    >
      <For each={pcs}>{(pc) => <PcCard pc={pc} token={token} />}</For>
    </Grid>
  );
};