"use client";

import { LuPower } from "react-icons/lu";
import { IconButton } from "@chakra-ui/react";
import { useState } from "react";
import { useExtracted } from "next-intl";
import { Tooltip } from "@/components/ui/chakra/tooltip";

interface Props {
  hidden?: boolean;
  onClick?: () => Promise<void> | void;
}

export default function PowerOnButton({ hidden, onClick }: Props) {
  const t = useExtracted("pc-power-on-button");
  const [loading, setLoading] = useState<boolean>(false);

  const handleClick = async () => {
    setLoading(true);
    await onClick?.();
    setLoading(false);
  };

  return (
    <Tooltip
      content={t({
        message: "Power on",
        description: "tooltip",
      })}
    >
      <IconButton
        hidden={hidden}
        variant="outline"
        onClick={handleClick}
        loading={loading}
      >
        <LuPower />
      </IconButton>
    </Tooltip>
  );
}
