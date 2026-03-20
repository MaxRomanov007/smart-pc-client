"use client";

import { useCallback, useEffect } from "react";
import { fetchUserPcBySlug } from "@/services/pcs";
import useServiceQuery from "@/utils/hooks/services/use-service-query";
import { handleError } from "@/utils/errors";
import { useExtracted } from "next-intl";
import { notFound } from "next/navigation";
import { StatusCodes } from "@/types/services/response";
import { CommandsProvider } from "@/utils/hooks/commands/provider";
import PcOnlineOnlyView from "@/app/[locale]/dashboard/[slug]/(components)/page/pc-online-only-view";
import { useStandardBreadcrumbs } from "@/utils/hooks/ui/breadcrumbs/client";
import { Stack } from "@chakra-ui/react";
import Breadcrumbs from "@/components/breadcrumbs/breadcrumbs";
import { useRequireAuth } from "@/lib/auth/use-auth";

interface Props {
  slug: string;
}

export function SlugPcPage({ slug }: Props) {
  const t = useExtracted("slug-pc-page");
  const { accessToken } = useRequireAuth();
  const fetchPcsQuery = useCallback(
    () => fetchUserPcBySlug(accessToken ?? "", slug),
    [slug, accessToken],
  );
  const {
    data: pc,
    error,
    isError,
    status,
  } = useServiceQuery(fetchPcsQuery, { enabled: !!accessToken });

  const breadcrumbs = useStandardBreadcrumbs();

  useEffect(() => {
    if (!!error) {
      handleError(
        t({
          message: "Error occurred while fetching pc",
          description: "pcs error message title",
        }),
        error.message,
      );
    }
  }, [error, t]);

  useEffect(() => {
    document.title = t({
      message: "PC {name}",
      values: {
        name: pc?.name ?? "",
      },
      description: "page title",
    });
  }, [pc?.name, t]);

  if (status === StatusCodes.notFound) {
    notFound();
  }

  if (isError || !pc) {
    return null;
  }

  return (
    <CommandsProvider>
      <Stack gap={4} h="full">
        <Breadcrumbs
          items={[breadcrumbs.index, breadcrumbs.dashboard, { label: pc.name }]}
        />
        <PcOnlineOnlyView pc={pc} />
      </Stack>
    </CommandsProvider>
  );
}
