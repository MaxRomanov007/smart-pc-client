"use client";

import { CommandsProvider } from "@/utils/hooks/commands/provider";
import PcOnlineOnlyView from "@/app/[locale]/dashboard/[slug]/(components)/page/pc-online-only-view";
import { useStandardBreadcrumbs } from "@/utils/hooks/ui/breadcrumbs/client";
import { Stack } from "@chakra-ui/react";
import Breadcrumbs from "@/components/breadcrumbs/breadcrumbs";
import { useSlugPcQuery } from "@/utils/hooks/queries/pcs";

interface Props {
  slug: string;
}

export function SlugPcPage({ slug }: Props) {
  const { data, isError } = useSlugPcQuery(slug);

  const breadcrumbs = useStandardBreadcrumbs();

  if (isError || !data) {
    return null;
  }

  return (
    <CommandsProvider>
      <Stack gap={4} h="full">
        <Breadcrumbs
          items={[
            breadcrumbs.index,
            breadcrumbs.dashboard,
            { label: data.name },
          ]}
        />
        <PcOnlineOnlyView pc={data} />
      </Stack>
    </CommandsProvider>
  );
}
