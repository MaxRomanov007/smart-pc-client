import { Icon } from "@chakra-ui/react";
import type { ComponentProps } from "react";

export default function AccentIcon({
  children,
  ...props
}: Omit<ComponentProps<typeof Icon>, "color">) {
  return (
    <Icon
      color={{ _light: "colorPalette.700", _dark: "colorPalette.300" }}
      {...props}
    >
      {children}
    </Icon>
  );
}
