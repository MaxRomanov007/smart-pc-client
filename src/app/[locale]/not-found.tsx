import type { Metadata } from "next";
import { Center, Container, Heading, Text, VStack } from "@chakra-ui/react";
import AccentIcon from "@/components/ui/icon/accent-icon";
import { LuAntenna } from "react-icons/lu";
import LinkButton from "@/components/ui/button/link-button";
import { PAGES } from "@/config/navigation/pages";
import { getExtracted } from "next-intl/server";

export const metadata: Metadata = {
  title: "Locale",
};

export default async function LocalePage() {
  const t = await getExtracted("not-found-page");

  return (
    <Center h="full">
      <Container maxW="sm">
        <VStack textAlign="center" gap={4}>
          <AccentIcon w={24} h={24}>
            <LuAntenna />
          </AccentIcon>
          <Heading as="h1">
            {t({
              message: "This page couldn't be found",
              description: "not found page title",
            })}
          </Heading>
          <Text color="fg.muted">
            {t({
              message:
                "Looks like mistakes in url. Check it or go to the main page",
              description:
                "not found page help text with offer for go to the main page",
            })}
          </Text>
          <LinkButton href={PAGES.index}>
            {t({
              message: "Go to main page",
              description: "not found page link button for main page text",
            })}
          </LinkButton>
        </VStack>
      </Container>
    </Center>
  );
}
