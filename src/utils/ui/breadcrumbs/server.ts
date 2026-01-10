import { PAGES } from "@/config/navigation/pages";
import { getExtracted } from "next-intl/server";

export async function getStandardBreadcrumbs() {
  const t = await getExtracted("breadcrumbs");

  return {
    dashboard: {
      href: PAGES.dashboard,
      label: t({
        message: "Dashboard",
        description: "dashboard breadcrumb",
      }),
    },
  };
}
