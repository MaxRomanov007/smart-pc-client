"use client";

import { EmptyState, VStack } from "@chakra-ui/react";
import { LuMonitorOff } from "react-icons/lu";
import { useExtracted } from "next-intl";

export default function PcListEmptyState() {
  const t = useExtracted("pc-list-empty-state");

  return (
    <EmptyState.Root size={["md", null, null, "lg"]}>
      <EmptyState.Content>
        <EmptyState.Indicator>
          <LuMonitorOff />
        </EmptyState.Indicator>
        <VStack textAlign="center">
          <EmptyState.Title>
            {t({
              message: "Your pc list is empty",
              description: "pc list empty state title",
            })}
          </EmptyState.Title>
          <EmptyState.Description>
            {t({
              message: "There are not pcs registered on your account",
              description: "pc list empty state description",
            })}
          </EmptyState.Description>
        </VStack>
      </EmptyState.Content>
    </EmptyState.Root>
  );
}
