import type { INavigationTab } from "@/@types/ui/navigation/navigation-tab";
import { useExtracted } from "next-intl";
import { PAGES } from "@/config/navigation/pages";
import { LuHouse } from "react-icons/lu";

export function useStandardTabs(): INavigationTab[] {
  const t = useExtracted("navigation-tabs");

  return [
    {
      icon: <LuHouse />,
      href: PAGES.dashboard,
      label: t({
        message: "Dashboard",
        description: "dashboard tab item label",
      }),
      tooltip: t({
        message: "Dashboard",
        description: "dashboard tab item tooltip",
      }),
    },
  ];
}
