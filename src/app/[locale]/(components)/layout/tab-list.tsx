"use client";

import { NAVIGATION_TABS } from "@/config/navigation/tabs";
import { VStack } from "@chakra-ui/react";
import NavigationTab from "@/app/[locale]/(components)/layout/navigation-tab";
import { usePathname } from "@/i18n/navigation";
import type { INavigationTab } from "@/@types/ui/i-navigation-tab";

interface Props {
  collapsed?: boolean;
  onSelect?: (tab: INavigationTab) => void;
}

export default function TabList({ collapsed, onSelect }: Props) {
  const pathname = usePathname();

  return (
    <VStack as="nav" w="full">
      {NAVIGATION_TABS.map((tab) => (
        <NavigationTab
          key={tab.name}
          tab={tab}
          collapsed={collapsed}
          isSelected={pathname.startsWith(tab.href)}
          onSelect={onSelect}
        />
      ))}
    </VStack>
  );
}
