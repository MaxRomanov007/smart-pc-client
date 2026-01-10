"use client";

import { HStack, useBreakpointValue } from "@chakra-ui/react";
import ChangeVisibilityButton from "@/components/button/change-visibility-button";
import { ColorModeButton } from "@/components/ui/chakra/color-mode";
import { useExtracted } from "next-intl";
import LocalizationSelect from "@/components/i18n/localization-select";
import MenuDrawer from "@/app/[locale]/(components)/layout/menu-drawer";

interface Props {
  setIsPanelOpen: (open: boolean) => void;
  isPanelOpen: boolean;
}

export default function FunctionalBlockLeft({
  isPanelOpen,
  setIsPanelOpen,
}: Props) {
  const t = useExtracted("header-left-functional-block");
  const isBurgerMenu = useBreakpointValue({ base: true, md: false });

  const tooltipText = isPanelOpen
    ? t({
        message: "Hide menu",
        description:
          "tooltip of change visibility button for side panel to hide it",
      })
    : t({
        message: "Show menu",
        description:
          "tooltip of change visibility button for side panel to show it",
      });

  return (
    <HStack gap={[1, null, 2]}>
      {isBurgerMenu ? (
        <MenuDrawer />
      ) : (
        <ChangeVisibilityButton
          tooltip={tooltipText}
          isVisible={isPanelOpen}
          setIsVisible={setIsPanelOpen}
          size={["sm", null, "md"]}
        />
      )}

      <ColorModeButton size="md" hideBelow="md" />

      <LocalizationSelect />
    </HStack>
  );
}
