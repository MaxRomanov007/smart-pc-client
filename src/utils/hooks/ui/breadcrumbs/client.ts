import { useExtracted } from "next-intl";
import { PAGES } from "@/config/navigation/pages";

export function useStandardBreadcrumbs() {
  const t = useExtracted("breadcrumbs");

  return {
    index: {
      href: PAGES.index,
      label: t({
        message: "Index",
        description: "index breadcrumb",
      }),
    },
    dashboard: {
      href: PAGES.dashboard,
      label: t({
        message: "Dashboard",
        description: "dashboard breadcrumb",
      }),
    },
    thisPc: {
      href: PAGES.thisPc,
      label: t({
        message: "This PC",
        description: "this pc breadcrumb",
      }),
    },
  };
}
