"use client";

import PcListUpdater from "@/app/[locale]/dashboard/(components)/pcs/pc-list-updater";
import PcListSkeleton from "@/app/[locale]/dashboard/(components)/pcs/pc-list-skeleton";
import { CommandsProvider } from "@/utils/hooks/commands/provider";
import { usePcsQuery } from "@/utils/hooks/queries/pcs";

export default function OnlinePcs() {
  const { data, isLoading, isError } = usePcsQuery();

  if (isError) {
    return null;
  }

  if (isLoading || !data) return <PcListSkeleton />;

  return (
    <CommandsProvider>
      <PcListUpdater pcs={data} />
    </CommandsProvider>
  );
}
