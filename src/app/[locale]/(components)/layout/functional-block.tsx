"use client";

import { HStack } from "@chakra-ui/react";
import ChangeVisibilityButton from "@/components/button/change-visibility-button";
import { ColorModeButton } from "@/components/ui/chakra/color-mode";
import { useExtracted } from "next-intl";
import LocalizationSelect from "@/components/i18n/localization-select";

interface Props {
  setIsPanelOpen: (open: boolean) => void;
  isPanelOpen: boolean;
}

export default function FunctionalBlock({
  isPanelOpen,
  setIsPanelOpen,
}: Props) {
  const t = useExtracted();

  return (
    <HStack gap={[1, null, 2]}>
      <ChangeVisibilityButton
        tooltip={
          isPanelOpen
            ? t({
                message: "Hide menu",
                description:
                  "tooltip of change visibility button for side panel to hide it",
              })
            : t({
                message: "Show menu",
                description:
                  "tooltip of change visibility button for side panel to show it",
              })
        }
        isVisible={isPanelOpen}
        setIsVisible={setIsPanelOpen}
        size={["sm", null, "md"]}
      />

      <ColorModeButton size={["sm", null, "md"]} />

      <LocalizationSelect />
    </HStack>
  );
}
