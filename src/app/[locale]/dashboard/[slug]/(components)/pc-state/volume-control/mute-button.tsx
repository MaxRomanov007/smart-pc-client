"use client";

import { useCommands } from "@/utils/hooks/commands/hook";
import { useCallback, useMemo } from "react";
import { IconButton } from "@chakra-ui/react";
import { LuVolume, LuVolume1, LuVolume2, LuVolumeX } from "react-icons/lu";
import type { IPc } from "@/types/pc/pc";
import type { VolumeState } from "@/types/mqtt/pc-state";

interface Props {
  pc: IPc;
  state: VolumeState;
  onMutedChange?: (muted: boolean) => void;
}

export default function MuteButton({ pc, state, onMutedChange }: Props) {
  const { doCommand } = useCommands();

  const handleClick = useCallback(() => {
    doCommand({
      pc,
      name: state.muted ? "unmute" : "mute",
      withoutDialog: true,
    });

    onMutedChange?.(!state.muted);
  }, [doCommand, state.muted, onMutedChange, pc]);

  const icon = useMemo(() => {
    if (state.muted) {
      return <LuVolumeX />;
    }

    if (!state.current || state.current === 0) {
      return <LuVolume />;
    } else if (state.current >= 50) {
      return <LuVolume2 />;
    } else {
      return <LuVolume1 />;
    }
  }, [state]);

  return (
    <IconButton onClick={handleClick} variant="ghost" size="xs">
      {icon}
    </IconButton>
  );
}
