"use client";

import { useToken } from "@/contexts/token";
import PcListUpdater from "@/app/[locale]/dashboard/(components)/pcs/pc-list-updater";
import type { IPc } from "@/@types/pc/pc";
import PcListSkeleton from "@/app/[locale]/dashboard/(components)/pcs/pc-list-skeleton";
import { authClient } from "@/utils/auth/client";
import { toaster } from "@/components/ui/chakra/toaster";
import { useExtracted } from "next-intl";

interface Props {
  pcs: IPc[];
}

export default function OnlinePcs({ pcs }: Props) {
  const { token, loading } = useToken();
  const { data, isPending, error } = authClient.useSession();
  const t = useExtracted("online-pcs");

  if (error) {
    toaster.error({
      title: t("Error"),
    });
    return;
  }

  if (!token || loading || isPending || !data) return <PcListSkeleton />;

  return <PcListUpdater token={token} pcs={pcs} userID={data.user.oid} />;
}
