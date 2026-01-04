import type { NavigationTab } from "@/@types/ui/navigation-tab";
import AccentIcon from "@/components/ui/icon/accent-icon";
import { Button } from "@chakra-ui/react";
import { Tooltip } from "@/components/ui/chakra/tooltip";
import { Link } from "@/i18n/navigation";
import { useExtracted } from "next-intl";

interface Props {
  tab: NavigationTab;
  collapsed?: boolean;
}

export default function NavigationTab({ tab, collapsed }: Props) {
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

  return (
    <Tooltip content={tooltipText}>
      <Button
        w="full"
        justifyContent="start"
        variant="ghost"
        px={2.5}
        size={["sm", null, "md"]}
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
