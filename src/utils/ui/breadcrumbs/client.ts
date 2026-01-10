import { useExtracted } from "next-intl";
import { PAGES } from "@/config/navigation/pages";

export function useStandardBreadcrumbs() {
  const t = useExtracted("breadcrumbs");

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
