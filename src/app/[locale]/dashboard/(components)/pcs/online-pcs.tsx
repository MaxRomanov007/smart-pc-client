"use client";

import PcListUpdater from "@/app/[locale]/dashboard/(components)/pcs/pc-list-updater";
import PcListSkeleton from "@/app/[locale]/dashboard/(components)/pcs/pc-list-skeleton";
import { useSecureAuth } from "@/utils/hooks/auth";
import useServiceQuery from "@/utils/hooks/services/use-service-query";
import { fetchUserPcs } from "@/services/pcs";
import { useCallback, useEffect } from "react";
import { handleError } from "@/utils/errors";
import { useExtracted } from "next-intl";

export default function OnlinePcs() {
  const t = useExtracted("online-pcs");
  const { token, user } = useSecureAuth();
  const fetchPcsQuery = useCallback(() => fetchUserPcs(token), [token]);
  const {
    data: pcs,
    error,
    isError,
    loading,
  } = useServiceQuery(fetchPcsQuery, { enabled: !!token });

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

  if (loading || !user || !pcs) return <PcListSkeleton />;

  return <PcListUpdater token={token} pcs={pcs} userID={user.id} />;
}
