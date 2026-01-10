"use client";

import type { IconButtonProps, SpanProps } from "@chakra-ui/react";
import { ClientOnly, IconButton, Skeleton, Span } from "@chakra-ui/react";
import type { ThemeProviderProps } from "next-themes";
import { ThemeProvider, useTheme } from "next-themes";
import * as React from "react";
import { LuLaptopMinimal, LuMoon, LuSun } from "react-icons/lu";
import { Tooltip } from "@/components/ui/chakra/tooltip";
import { useExtracted } from "next-intl";

export type ColorModeProviderProps = ThemeProviderProps;

export function ColorModeProvider(props: ColorModeProviderProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      disableTransitionOnChange
      {...props}
    />
  );
}

export type ColorMode = "light" | "dark" | "system";

export interface UseColorModeReturn {
  colorMode: ColorMode;
  setColorMode: (colorMode: ColorMode) => void;
  toggleColorMode: () => void;
}

export function useColorMode(): UseColorModeReturn {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const colorMode = (theme || resolvedTheme) as ColorMode;

  const toggleColorMode = () => {
    if (theme === "system") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("light");
    } else if (theme === "light") {
      setTheme("system");
    }
  };

  return {
    colorMode,
    setColorMode: setTheme,
    toggleColorMode,
  };
}

export function useColorModeValue<T>(light: T, dark: T) {
  const { colorMode } = useColorMode();
  return colorMode === "dark" ? dark : light;
}

export function ColorModeIcon() {
  const { colorMode } = useColorMode();
  if (colorMode === "system") {
    return <LuLaptopMinimal />;
  }
  return colorMode === "dark" ? <LuMoon /> : <LuSun />;
}

type ColorModeButtonProps = Omit<IconButtonProps, "aria-label">;

const ColorModeButtonTooltip = ({
  colorMode,
  children,
}: {
  colorMode: ColorMode;
  children: React.ReactNode;
}) => {
  const t = useExtracted("color-mode-button");

  const tooltip =
    colorMode === "system"
      ? t({
          message: "Change to dark theme",
          description: "tooltip of color mode button to change to dark theme",
        })
      : colorMode === "dark"
        ? t({
            message: "Change to light theme",
            description:
              "tooltip of color mode button to change to light theme",
          })
        : t({
            message: "Change to system theme",
            description:
              "tooltip of color mode button to change to system theme",
          });

  return <Tooltip content={tooltip}>{children}</Tooltip>;
};

export const ColorModeButton = React.forwardRef<
  HTMLButtonElement,
  ColorModeButtonProps
>(function ColorModeButton(props, ref) {
  const { toggleColorMode, colorMode } = useColorMode();

  return (
    <ClientOnly fallback={<Skeleton boxSize="9" />}>
      <ColorModeButtonTooltip colorMode={colorMode}>
        <IconButton
          onClick={toggleColorMode}
          variant="ghost"
          aria-label="Toggle color mode"
          size="md"
          ref={ref}
          {...props}
          css={{
            _icon: {
              width: "5",
              height: "5",
            },
          }}
        >
          <ColorModeIcon />
        </IconButton>
      </ColorModeButtonTooltip>
    </ClientOnly>
  );
});

export const LightMode = React.forwardRef<HTMLSpanElement, SpanProps>(
  function LightMode(props, ref) {
    return (
      <Span
        color="fg"
        display="contents"
        className="chakra-theme light"
        colorPalette="gray"
        colorScheme="light"
        ref={ref}
        {...props}
      />
    );
  },
);

export const DarkMode = React.forwardRef<HTMLSpanElement, SpanProps>(
  function DarkMode(props, ref) {
    return (
      <Span
        color="fg"
        display="contents"
        className="chakra-theme dark"
        colorPalette="gray"
        colorScheme="dark"
        ref={ref}
        {...props}
      />
    );
  },
);
