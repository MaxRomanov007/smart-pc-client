import { Badge } from "@chakra-ui/react";
import { LuWifi } from "react-icons/lu";
import type { ComponentProps } from "react";

export default function OnlineBadgeBase({ children, ...props }: ComponentProps<typeof Badge>) {
  return (
    <Badge {...props}>
      <LuWifi />
      {children}
    </Badge>
  );
}
