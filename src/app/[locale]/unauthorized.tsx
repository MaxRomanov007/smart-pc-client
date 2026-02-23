import type { Metadata } from "next";
import { AbsoluteCenter, Container, Heading, Text, VStack } from "@chakra-ui/react";
import SignInButton from "@/components/button/auth/sign-in-button";
import AccentIcon from "@/components/ui/icon/accent-icon";
import { LuOctagonX } from "react-icons/lu";
import { getExtracted } from "next-intl/server";

export const metadata: Metadata = {
  title: "Unauthorized",
};

export default async function UnauthorizedPage() {
  const t = await getExtracted("unauthorized page");

  return (
    <AbsoluteCenter>
      <Container maxW="sm">
        <VStack textAlign="center" gap={4}>
          <AccentIcon w={24} h={24}>
            <LuOctagonX />
          </AccentIcon>
          <Heading as="h1">
            {t({
              message: "You're not authorized",
              description: "unauthorized page title",
            })}
          </Heading>
          <Text color="fg.muted" lineClamp={3}>
            {t({
              message:
                "You're not authorized. Sign in by click button below to access this page",
              description: "description",
            })}
          </Text>
          <SignInButton variant="solid" />
        </VStack>
      </Container>
    </AbsoluteCenter>
  );
}
