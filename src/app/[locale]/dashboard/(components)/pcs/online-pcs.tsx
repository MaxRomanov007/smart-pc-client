"use client";

import PcListUpdater from "@/app/[locale]/dashboard/(components)/pcs/pc-list-updater";
import PcListSkeleton from "@/app/[locale]/dashboard/(components)/pcs/pc-list-skeleton";
import { useSecureAuth } from "@/utils/hooks/auth";
import useServiceQuery from "@/utils/hooks/services/use-service-query";
import { fetchUserPcs } from "@/services/pcs";
import { useCallback, useEffect } from "react";
import { toaster } from "@/components/ui/chakra/toaster";

export default function OnlinePcs() {
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
      console.log(error);
      queueMicrotask(() =>
        toaster.error({
          title: "Error occurred while fetching pcs",
          description: error.message,
        }),
      );
      throw {
        message: "Error occurred while fetching pcs",
        digest: error.message,
      };
    }
  }, [error]);

  if (isError) {
    return null;
  }

  if (loading || !user || !pcs) return <PcListSkeleton />;

  return <PcListUpdater token={token} pcs={pcs} userID={user.id} />;
}
