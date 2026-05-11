"use client";

import { IconButton } from "@chakra-ui/react";
import { useState } from "react";
import { useExtracted } from "next-intl";
import { Tooltip } from "@/components/ui/chakra/tooltip";
import { LuPowerOff } from "react-icons/lu";

interface Props {
  hidden?: boolean;
  onClick?: () => Promise<void> | void;
}

export default function PowerOffButton({ hidden, onClick }: Props) {
  const t = useExtracted("pc-power-off-button");
  const [loading, setLoading] = useState<boolean>(false);

  const handleClick = async () => {
    setLoading(true);
    await onClick?.();
    setLoading(false);
  };

  return (
    <Tooltip
      content={t({
        message: "Power off",
        description: "tooltip",
      })}
    >
      <IconButton
        hidden={hidden}
        variant="outline"
        onClick={handleClick}
        loading={loading}
      >
        <LuPowerOff />
      </IconButton>
    </Tooltip>
  );
}
