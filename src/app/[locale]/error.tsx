"use client";

import {
  Button,
  Center,
  Container,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";
import AccentIcon from "@/components/ui/icon/accent-icon";
import { LuTriangleAlert } from "react-icons/lu";
import { useExtracted } from "next-intl";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useExtracted("error-page");

  return (
    <Center h="full">
      <Container maxW="sm">
        <VStack textAlign="center" gap={4}>
          <AccentIcon w={24} h={24}>
            <LuTriangleAlert />
          </AccentIcon>
          <Heading as="h1">
            {t({
              message: "Something went wrong",
              description: "error page title",
            })}
          </Heading>
          <Text color="fg.muted">{error.message}</Text>
          <Button onClick={() => reset()}>
            {t({
              message: "Reset",
              description: "reset button text",
            })}
          </Button>
        </VStack>
      </Container>
    </Center>
  );
}
