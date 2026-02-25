import { PAGES } from "@/config/navigation/pages";
import { getExtracted } from "next-intl/server";

export async function getStandardBreadcrumbs(current: boolean = false) {
  const t = await getExtracted("breadcrumbs");

  return {
    dashboard: {
      href: current ? undefined : PAGES.dashboard,
      label: t({
        message: "Dashboard",
        description: "dashboard breadcrumb",
      }),
    },
  };
}
