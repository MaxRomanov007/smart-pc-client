import type { INavigationTab } from "@/@types/ui/navigation/navigation-tab";
import AccentIcon from "@/components/ui/icon/accent-icon";
import { Button } from "@chakra-ui/react";
import { Tooltip } from "@/components/ui/chakra/tooltip";
import { Link } from "@/i18n/navigation";
import { type MouseEventHandler } from "react";

interface Props {
  tab: INavigationTab;
  collapsed?: boolean;
  selected?: boolean;
  onSelect?: (tab: INavigationTab) => void;
}

export default function NavigationTab({
  tab,
  collapsed,
  selected,
  onSelect,
}: Props) {
  const handleClick: MouseEventHandler<HTMLButtonElement> = () => {
    onSelect?.(tab);
  };

  return (
    <Tooltip content={tab.tooltip}>
      <Button
        w="full"
        justifyContent="start"
        variant={selected ? "subtle" : "ghost"}
        px={2.5}
        size={["sm", null, "md"]}
        onClick={handleClick}
        asChild
      >
        <Link href={tab.href}>
          <AccentIcon>{tab.icon}</AccentIcon>

          {!collapsed && tab.label}
        </Link>
      </Button>
    </Tooltip>
  );
}
