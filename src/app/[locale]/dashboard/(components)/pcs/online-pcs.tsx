"use client";

import PcListUpdater from "@/app/[locale]/dashboard/(components)/pcs/pc-list-updater";
import type { IPc } from "@/@types/pc/pc";
import PcListSkeleton from "@/app/[locale]/dashboard/(components)/pcs/pc-list-skeleton";
import { useSession } from "next-auth/react";

interface Props {
  pcs: IPc[];
}

export default function OnlinePcs({ pcs }: Props) {
  const { data, status } = useSession();

  if (status === "loading" || !data?.user) return <PcListSkeleton />;

  return (
    <PcListUpdater
      token={data.user.accessToken}
      pcs={pcs}
      userID={data.user.id ?? ""}
    />
  );
}
