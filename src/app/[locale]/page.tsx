import type { Metadata } from "next";
import { getExtracted } from "next-intl/server";
import { AbsoluteCenter, HStack, Icon, Text, VStack } from "@chakra-ui/react";
import RomanovDigitalMiniLogo from "@/components/icons/logo/romanov-digital/mini";
import RomanovDigitalFullLogo from "@/components/icons/logo/romanov-digital/full";
import SmartPCLogo from "@/components/icons/logo/smart-pc/full";
import { getSession } from "@/utils/auth/server";
import SignOutButton from "@/app/[locale]/(components)/sign-out-button";
import TestToastButton from "@/app/[locale]/(components)/test-toast-button";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getExtracted();

  return {
    title: t({
      message: "Index page",
      description: "title of index page in metadata",
    }),
  };
}

export default async function MainPage() {
  const t = await getExtracted();
  const session = await getSession();

  return (
    <AbsoluteCenter>
      <VStack gap={8}>
        <Text>
          {t({
            message: "Hello, {name}",
            values: {
              name: session.user.name,
            },
            description: "user greeting",
          })}
        </Text>

        <SignOutButton />

        <TestToastButton />

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
