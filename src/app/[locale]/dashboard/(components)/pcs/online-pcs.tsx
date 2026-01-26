"use client";

import { useToken } from "@/contexts/token";
import PcListUpdater from "@/app/[locale]/dashboard/(components)/pcs/pc-list-updater";
import type { IPc } from "@/@types/pc/pc";
import PcListSkeleton from "@/app/[locale]/dashboard/(components)/pcs/pc-list-skeleton";

interface Props {
  pcs: IPc[];
}

export default function OnlinePcs({ pcs }: Props) {
  const { token, loading } = useToken();

  if (!token || loading) return <PcListSkeleton />;

  return <PcListUpdater token={token} pcs={pcs} />;
}
