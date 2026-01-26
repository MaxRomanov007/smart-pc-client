import { Icon } from "@chakra-ui/react";
import type { ComponentProps } from "react";

export default function AccentIcon({
  children,
  colorPalette,
  ...props
}: Omit<ComponentProps<typeof Icon>, "color">) {
  const palette = colorPalette ? colorPalette : "colorPalette";
  return (
    <Icon
      color={{ _light: palette + ".700", _dark: palette + ".300" }}
      {...props}
    >
      {children}
    </Icon>
  );
}
