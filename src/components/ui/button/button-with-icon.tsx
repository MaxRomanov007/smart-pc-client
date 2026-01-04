import { Button } from "@chakra-ui/react";
import type { ComponentProps, ReactNode } from "react";
import AccentIcon from "@/components/ui/icon/accent-icon";

interface Props extends ComponentProps<typeof Button> {
  icon: ReactNode;
  collapsed?: boolean;
}

export default function ButtonWithIcon({
  icon,
  collapsed,
  children,
  ...props
}: Props) {
  return (
    <Button {...props} w="full" justifyContent="start">
      <AccentIcon>{icon}</AccentIcon>

      {!collapsed && children}
    </Button>
  );
}
