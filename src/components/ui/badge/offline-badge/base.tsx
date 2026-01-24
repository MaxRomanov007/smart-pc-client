import { Badge } from "@chakra-ui/react";
import { LuWifiOff } from "react-icons/lu";
import type { ComponentProps } from "react";

export default function OfflineBadgeBase({ children, ...props }: ComponentProps<typeof Badge>) {
  return (
    <Badge size={["sm", null, null, "md"]} {...props}>
      <LuWifiOff />
      {children}
    </Badge>
  );
}
