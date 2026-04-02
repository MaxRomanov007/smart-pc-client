"use client";

import { useExtracted } from "next-intl";
import { LuSquarePen } from "react-icons/lu";
import { Button } from "@chakra-ui/react";

export function EditButton() {
  const t = useExtracted("agent-command-edit-button");

  return (
    <Button>
      <LuSquarePen />

      {t("Edit")}
    </Button>
  );
}
