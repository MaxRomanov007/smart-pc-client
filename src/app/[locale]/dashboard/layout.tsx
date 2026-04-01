import type { ReactNode } from "react";
import { getStandardBreadcrumbs } from "@/utils/hooks/ui/breadcrumbs/server";
import { Flex } from "@chakra-ui/react";
import Breadcrumbs from "@/components/breadcrumbs/breadcrumbs";

export default async function Layout({ children }: { children: ReactNode }) {
  const breadcrumbs = await getStandardBreadcrumbs(true);

  return (
    <Flex direction="column" gap={4}>
      <Breadcrumbs items={[breadcrumbs.index, breadcrumbs.dashboard]} />
      {children}
    </Flex>
  );
}
