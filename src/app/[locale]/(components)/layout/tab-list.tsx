"use client";

import { VStack } from "@chakra-ui/react";
import NavigationTab from "@/app/[locale]/(components)/layout/navigation-tab";
import { usePathname } from "@/i18n/navigation";
import type { INavigationTab } from "@/@types/ui/navigation/navigation-tab";
import { useStandardTabs } from "@/utils/ui/tabs/client";

interface Props {
  collapsed?: boolean;
  onSelect?: (tab: INavigationTab) => void;
}

export default function TabList({ collapsed, onSelect }: Props) {
  const pathname = usePathname();
  const tabs = useStandardTabs();

  return (
    <VStack as="nav" w="full">
      {tabs.map((tab) => (
        <NavigationTab
          key={tab.href}
          tab={tab}
          collapsed={collapsed}
          selected={pathname.startsWith(tab.href)}
          onSelect={onSelect}
        />
      ))}
    </VStack>
  );
}
