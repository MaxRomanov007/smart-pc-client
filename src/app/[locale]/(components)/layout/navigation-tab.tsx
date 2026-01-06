"use client";

import type { INavigationTab } from "@/@types/ui/navigation/navigation-tab";
import AccentIcon from "@/components/ui/icon/accent-icon";
import { Button } from "@chakra-ui/react";
import { Tooltip } from "@/components/ui/chakra/tooltip";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

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
  const t = useTranslations();

  const handleClick = () => {
    onSelect?.(tab);
  };

  return (
    <Tooltip content={t(tab.tooltipMessageId)}>
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

          {!collapsed && t(tab.textMessageId)}
        </Link>
      </Button>
    </Tooltip>
  );
}
