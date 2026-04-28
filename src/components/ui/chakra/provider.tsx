"use client";

import { type ColorModeProviderProps } from "./color-mode";
import system from "@/config/ui/chakra";
import dynamic from "next/dynamic";
import { Toaster } from "@/components/ui/chakra/toaster";

const ChakraProvider = dynamic(
  () => import("@chakra-ui/react").then((mod) => mod.ChakraProvider),
  { ssr: false },
);

const ColorModeProvider = dynamic(
  () => import("./color-mode").then((mod) => mod.ColorModeProvider),
  { ssr: false },
);

export function Provider(props: ColorModeProviderProps) {
  return (
    <ChakraProvider value={system}>
      <ColorModeProvider {...props} />
      <Toaster />
    </ChakraProvider>
  );
}
