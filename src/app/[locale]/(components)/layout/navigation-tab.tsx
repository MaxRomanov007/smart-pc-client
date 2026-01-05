"use client";

import type { INavigationTab } from "@/@types/ui/i-navigation-tab";
import AccentIcon from "@/components/ui/icon/accent-icon";
import { Button } from "@chakra-ui/react";
import { Tooltip } from "@/components/ui/chakra/tooltip";
import { Link } from "@/i18n/navigation";
import { useExtracted } from "next-intl";

interface Props {
  tab: INavigationTab;
  collapsed?: boolean;
  isSelected?: boolean;
  onSelect?: (tab: INavigationTab) => void;
}

export default function NavigationTab({
  tab,
  collapsed,
  isSelected,
  onSelect,
}: Props) {
  const t = useExtracted();

  const tooltipText = t({
    message:
      "{tabName, select, first {Fist tab} second {Second tab} third {Third tab} fourth {Fourth tab} fifth {Fifth tab} other {Unknown tab name}}",
    values: {
      tabName: tab.name,
    },
    description: `tab item tooltip for different tabs`,
  });

  const text = t({
    message:
      "{tabName, select, first {Fist} second {Second} third {Third} fourth {Fourth} fifth {Fifth} other {Unknown tab name}}",
    values: {
      tabName: tab.name,
    },
    description: `tab item text for different tabs`,
  });

  const handleClick = () => {
    onSelect?.(tab);
  };

  return (
    <Tooltip content={tooltipText}>
      <Button
        w="full"
        justifyContent="start"
        variant={isSelected ? "subtle" : "ghost"}
        px={2.5}
        size={["sm", null, "md"]}
        onClick={handleClick}
        asChild
      >
        <Link href={tab.href}>
          <AccentIcon>{tab.icon}</AccentIcon>

          {!collapsed && text}
        </Link>
      </Button>
    </Tooltip>
  );
}
