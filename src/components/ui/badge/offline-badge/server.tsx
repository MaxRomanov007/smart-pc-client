import type { ComponentProps } from "react";
import { Badge } from "@chakra-ui/react";
import { getExtracted } from "next-intl/server";
import OfflineBadgeBase from "@/components/ui/badge/offline-badge/base";

export default async function OfflineBadge(
  props: Omit<ComponentProps<typeof Badge>, "children">,
) {
  const t = await getExtracted("offline-badge");
  return <OfflineBadgeBase {...props}>{t("offline")}</OfflineBadgeBase>;
}
