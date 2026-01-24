"use client";

import { useExtracted } from "next-intl";
import type { ComponentProps } from "react";
import { Badge } from "@chakra-ui/react";
import OfflineBadgeBase from "@/components/ui/badge/offline-badge/base";

export default function OfflineBadge(
  props: Omit<ComponentProps<typeof Badge>, "children">,
) {
  const t = useExtracted("offline-badge");
  return <OfflineBadgeBase colorPalette={"gray"} {...props}>{t("offline")}</OfflineBadgeBase>;
}
