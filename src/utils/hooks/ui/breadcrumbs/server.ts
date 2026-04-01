import { PAGES } from "@/config/navigation/pages";
import { getExtracted } from "next-intl/server";

export async function getStandardBreadcrumbs(current: boolean = false) {
  const t = await getExtracted("breadcrumbs");

  return {
    index: {
      href: PAGES.index,
      label: t({
        message: "Index",
        description: "index breadcrumb",
      }),
    },
    dashboard: {
      href: current ? undefined : PAGES.dashboard,
      label: t({
        message: "Dashboard",
        description: "dashboard breadcrumb",
      }),
    },
    thisPc: {
      href: current ? undefined : PAGES.thisPc,
      label: t({
        message: "This PC",
        description: "this pc breadcrumb",
      }),
    },
  };
}
