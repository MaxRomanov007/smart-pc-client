"use client";

import { toaster } from "@/components/ui/chakra/toaster";
import { Button } from "@chakra-ui/react";
import { useExtracted } from "next-intl";

export default function TestToastButton() {
  const t = useExtracted();

  const handleClick = () => {
    toaster.info({
      title: "Toaster",
      description: "toaster",
    });
  };

  return <Button onClick={handleClick}>{t("Test Toast")}</Button>;
}
