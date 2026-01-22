import type { Metadata } from "next";
import { Heading, Stack, Text } from "@chakra-ui/react";
import Breadcrumbs from "@/components/breadcrumbs/breadcrumbs";
import { getStandardBreadcrumbs } from "@/utils/ui/breadcrumbs/server";
import { getExtracted } from "next-intl/server";
import { WebSocketDemo } from "@/app/[locale]/dashboard/websocket-demo";
import { getToken } from "@/utils/auth/server";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const breadcrumbs = await getStandardBreadcrumbs(true);
  const t = await getExtracted("dashboard-page");
  const token = await getToken()
  console.log("token", token)

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

        <WebSocketDemo/>
      </Stack>
    </Stack>
  );
}
