"use client";

import { authClient, SSO_PROVIDER_ID } from "@/utils/auth";
import { type MouseEventHandler, useState } from "react";
import { Button } from "@chakra-ui/react";
import { useExtracted } from "next-intl";

export default function SignInButton() {
  const t = useExtracted();
  const [loading, setLoading] = useState(false);

  const signIn = async () => {
    const { data, error } = await authClient.signIn.oauth2({
      providerId: SSO_PROVIDER_ID,
    });

    if (error) {
      return;
    }

    if (data?.url) {
      console.log(data?.url);
      window.location.href = data.url;
    }
  };

  const handleClick: MouseEventHandler<HTMLButtonElement> = async () => {
    setLoading(true);
    await signIn();
    setLoading(false);
  };

  return (
    <Button onClick={handleClick} loading={loading}>
      {t({
        message: "Sign In",
        description: "sign in button text",
      })}
    </Button>
  );
}
