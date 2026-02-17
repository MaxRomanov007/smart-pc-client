"use client";

import { useEffect } from "react";
import { useAuthContext } from "react-oauth2-code-pkce";
import { useRouter } from "next/navigation";
import { handleError } from "@/utils/errors";
import { useExtracted } from "next-intl";
import { Center, Spinner, Text, VStack } from "@chakra-ui/react";

export default function AuthCallback() {
  const t = useExtracted("auth-callback-error");
  const { token, error } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (token) {
      router.push("/");
    } else if (error) {
      handleError(
        t({
          message: "Authorization flow failed",
          description: "authorization flow failed message title",
        }),
        error,
      );
    }
  }, [token, error, router, t]);

  return (
    <Center>
      <VStack gap={4}>
        <Text
          color={{ _light: "colorPalette.700", _dark: "colorPalette.300" }}
          textStyle="lg"
        >
          {t({
            message: "Please wait for authorization to complete",
            description: "loading title",
          })}
        </Text>
        <Spinner
          color={{ _light: "colorPalette.600", _dark: "colorPalette.300" }}
          size={"xl"}
        />
      </VStack>
    </Center>
  );
}
