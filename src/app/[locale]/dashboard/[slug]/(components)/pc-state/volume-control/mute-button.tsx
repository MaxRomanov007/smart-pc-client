"use client";

import { useMemo } from "react";
import { LuVolume, LuVolume1, LuVolume2, LuVolumeX } from "react-icons/lu";
import type { IPc } from "@/types/pc/pc";
import type { VolumeState } from "@/types/mqtt/pc-state";
import CommandIconButton from "@/components/button/command/command-icon-button";

interface Props {
  pc: IPc;
  state: VolumeState;
  onMutedChange?: (muted: boolean) => void;
}

export default function MuteButton({ pc, state, onMutedChange }: Props) {
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
    <CommandIconButton
      pc={pc}
      commandName={state.muted ? "unmute" : "mute"}
      variant="ghost"
      size="xs"
      onClick={() => onMutedChange?.(!state.muted)}
    >
      {icon}
    </CommandIconButton>
  );
}
