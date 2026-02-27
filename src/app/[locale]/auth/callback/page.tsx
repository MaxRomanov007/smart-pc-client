"use client";

import { useEffect } from "react";
import { useAuthContext } from "react-oauth2-code-pkce";
import { useRouter, useSearchParams } from "next/navigation";
import { handleError } from "@/utils/errors";
import { useExtracted } from "next-intl";
import { Center, Spinner, Text, VStack } from "@chakra-ui/react";
import { LOGIN_REDIRECT_PATH_KEY } from "@/config/storage";

export default function AuthCallback() {
  const t = useExtracted("auth-callback-error");
  const { token, error } = useAuthContext();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (token) {
      const redirectPath = sessionStorage.getItem(LOGIN_REDIRECT_PATH_KEY);
      if (redirectPath) {
        sessionStorage.removeItem(LOGIN_REDIRECT_PATH_KEY);
      }
      router.push(redirectPath ?? "/");
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

  useEffect(() => {
    const error = searchParams.get("error");
    if (!error) {
      return;
    }

    const errorDescription = searchParams.get("error_description");
    handleError("Authorization failed: " + error, errorDescription ?? undefined);
  }, [searchParams]);

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
