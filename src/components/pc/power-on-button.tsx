"use client";

import { LuPower } from "react-icons/lu";
import { IconButton } from "@chakra-ui/react";
import { useState } from "react";

interface Props {
  hidden: boolean;
  onClick?: () => Promise<void> | void;
}

export default function PowerOnButton({ hidden, onClick }: Props) {
  const [loading, setLoading] = useState<boolean>(false);

  const handleClick = async () => {
    setLoading(true);
    await onClick?.();
    setLoading(false);
  };

  return (
    <IconButton
      hidden={hidden}
      variant="outline"
      onClick={handleClick}
      loading={loading}
    >
      <LuPower />
    </IconButton>
  );
}
