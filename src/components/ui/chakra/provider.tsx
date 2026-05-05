"use client";

import { ColorModeProvider, type ColorModeProviderProps } from "./color-mode";
import system from "@/config/ui/chakra";
import { Toaster } from "@/components/ui/chakra/toaster";
import { ChakraProvider } from "@chakra-ui/react";

export function Provider({ children, ...props }: ColorModeProviderProps) {
  return (
    <ChakraProvider value={system}>
      <ColorModeProvider {...props}>
        {children}
        <Toaster />
      </ColorModeProvider>
    </ChakraProvider>
  );
}
