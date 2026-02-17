import type { Metadata } from "next";
import { Heading, Stack, Text } from "@chakra-ui/react";
import Breadcrumbs from "@/components/breadcrumbs/breadcrumbs";
import { getStandardBreadcrumbs } from "@/utils/ui/breadcrumbs/server";
import { getExtracted } from "next-intl/server";
import OnlinePcs from "@/app/[locale]/dashboard/(components)/pcs/online-pcs";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const breadcrumbs = await getStandardBreadcrumbs(true);
  const t = await getExtracted("dashboard-page");

  return (
    <Stack gap={4} as="section">
      <Breadcrumbs items={[breadcrumbs.dashboard]} />
      <Stack gap={1}>
        <Heading size="3xl" as="h1">
          {t({
            message: "My PCs",
            description: "dashboard page title",
          })}
        </Heading>
        <Text color="fg.muted">
          {t({
            message: "Manage and control your registered computers",
            description: "dashboard page description",
          })}
        </Text>
      </Stack>

      <OnlinePcs />
    </Stack>
  );
}
