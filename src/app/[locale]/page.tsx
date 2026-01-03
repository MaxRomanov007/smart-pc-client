import type { Metadata } from "next";
import { getExtracted } from "next-intl/server";
import { AbsoluteCenter, HStack, Icon, VStack } from "@chakra-ui/react";
import RomanovDigitalMiniLogo from "@/components/icons/logo/romanov-digital/mini";
import RomanovDigitalFullLogo from "@/components/icons/logo/romanov-digital/full";
import SmartPCLogo from "@/components/icons/logo/smart-pc/full";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getExtracted();

  return {
    title: t({
      message: "Index page",
      description: "title of index page in metadata",
    }),
  };
}

export default async function LocalePage() {
  const t = await getExtracted();

  return (
    <AbsoluteCenter>
      <VStack gap={8}>
        <Icon
          color={{ _light: "colorPalette.700", _dark: "colorPalette.300" }}
          h={20}
          w="auto"
        >
          <RomanovDigitalFullLogo />
        </Icon>

        <HStack gap={8}>
          <Icon
            color={{ _light: "colorPalette.700", _dark: "colorPalette.300" }}
            h={10}
            w="auto"
          >
            <RomanovDigitalMiniLogo />
          </Icon>

          <Icon
            color={{ _light: "colorPalette.700", _dark: "colorPalette.300" }}
            h={10}
            w="auto"
          >
            <SmartPCLogo />
          </Icon>
        </HStack>
      </VStack>
    </AbsoluteCenter>
  );
}