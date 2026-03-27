"use client";

import { IconButton } from "@chakra-ui/react";
import {
  type ComponentProps,
  type MouseEventHandler,
  useCallback,
} from "react";
import { LuRefreshCw } from "react-icons/lu";
import { useQueryClient } from "@tanstack/react-query";
import { pcLogsQueryKeys } from "@/utils/hooks/queries/pcs/logs";

interface Props extends ComponentProps<typeof IconButton> {
  pcId: string;
}

export default function RefreshLogsButton({ pcId, onClick, ...props }: Props) {
  const queryClient = useQueryClient();

  const handleClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    async (e) => {
      await queryClient.resetQueries({
        queryKey: pcLogsQueryKeys.pcLogs(pcId),
      });

      onClick?.(e);
    },
    [onClick, pcId, queryClient],
  );

  return (
    <IconButton onClick={handleClick} {...props}>
      <LuRefreshCw />
    </IconButton>
  );
}
