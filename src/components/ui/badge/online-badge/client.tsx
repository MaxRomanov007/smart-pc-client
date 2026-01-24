"use client";

import { useExtracted } from "next-intl";
import OnlineBadgeBase from "@/components/ui/badge/online-badge/base";
import type { ComponentProps } from "react";
import { Badge } from "@chakra-ui/react";

export default function OnlineBadge(
  props: Omit<ComponentProps<typeof Badge>, "children">,
) {
  const t = useExtracted("online-badge");
  return <OnlineBadgeBase {...props}>{t("online")}</OnlineBadgeBase>;
}
