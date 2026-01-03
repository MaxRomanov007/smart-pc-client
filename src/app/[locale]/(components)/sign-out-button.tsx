"use client";

import { authClient } from "@/utils/auth";
import { type MouseEventHandler, useState } from "react";
import { Button } from "@chakra-ui/react";
import { useExtracted } from "next-intl";

export default function SignOutButton() {
  const t = useExtracted();
  const [loading, setLoading] = useState(false);

  const handleClick: MouseEventHandler<HTMLButtonElement> = async () => {
    setLoading(true);
    await authClient.signOut();
    setLoading(false);
  };

  return (
    <Button onClick={handleClick} loading={loading}>
      {t({
        message: "Sign Out",
        description: "sign out button text",
      })}
    </Button>
  );
}
