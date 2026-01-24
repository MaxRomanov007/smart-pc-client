import type { ComponentProps } from "react";
import { Badge } from "@chakra-ui/react";
import OnlineBadgeBase from "@/components/ui/badge/online-badge/base";
import { getExtracted } from "next-intl/server";

export default async function OnlineBadge(
  props: Omit<ComponentProps<typeof Badge>, "children">,
) {
  const t = await getExtracted("online-badge");
  return <OnlineBadgeBase {...props}>{t("online")}</OnlineBadgeBase>;
}
