"use client";

import PcListUpdater from "@/app/[locale]/dashboard/(components)/pcs/pc-list-updater";
import PcListSkeleton from "@/app/[locale]/dashboard/(components)/pcs/pc-list-skeleton";
import useServiceQuery from "@/utils/hooks/services/use-service-query";
import { fetchUserPcs } from "@/services/pcs";
import { useCallback, useEffect } from "react";
import { handleError } from "@/utils/errors";
import { useExtracted } from "next-intl";
import { CommandsProvider } from "@/utils/hooks/commands/provider";
import { useRequireAuth } from "@/lib/auth/use-auth";

export default function OnlinePcs() {
  const t = useExtracted("online-pcs");
  const { accessToken } = useRequireAuth();
  const fetchPcsQuery = useCallback(
    () => fetchUserPcs(accessToken ?? ""),
    [accessToken],
  );
  const {
    data: pcs,
    error,
    isError,
    loading,
  } = useServiceQuery(fetchPcsQuery, { enabled: !!accessToken });

  useEffect(() => {
    if (!!error) {
      handleError(
        t({
          message: "Error occurred while fetching pcs",
          description: "pcs error message title",
        }),
        error.message,
      );
    }
  }, [error, t]);

  if (isError) {
    return null;
  }

  if (loading || !pcs) return <PcListSkeleton />;

  return (
    <CommandsProvider>
      <PcListUpdater pcs={pcs} />
    </CommandsProvider>
  );
}
