"use client";

import PcListUpdater from "@/app/[locale]/dashboard/(components)/pcs/pc-list-updater";
import PcListSkeleton from "@/app/[locale]/dashboard/(components)/pcs/pc-list-skeleton";
import { pcsApi } from "@/services/pcs";
import { handleError } from "@/utils/errors";
import { useExtracted } from "next-intl";
import { CommandsProvider } from "@/utils/hooks/commands/provider";
import { useRequireAuth } from "@/lib/auth/use-auth";
import { useQuery } from "@tanstack/react-query";
import { StatusCodes } from "@/types/services/response";

export default function OnlinePcs() {
  const t = useExtracted("online-pcs");
  useRequireAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ["pcs"],
    queryFn: pcsApi.fetchUserPcs,
    retry: false,
  });

  if (error) {
    return null;
  }

  if (isLoading || !data) return <PcListSkeleton />;

  if (data.status && data.status != StatusCodes.ok) {
    handleError(
      t({
        message: "Error occurred while fetching user pcs",
        description: "request error message",
      }),
      data.error?.toString(),
    );
  }

  return (
    <CommandsProvider>
      <PcListUpdater pcs={data?.data ?? []} />
    </CommandsProvider>
  );
}
