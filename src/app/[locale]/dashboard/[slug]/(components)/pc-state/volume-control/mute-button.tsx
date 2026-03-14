"use client";

import { useMemo } from "react";
import { LuVolume, LuVolume1, LuVolume2, LuVolumeX } from "react-icons/lu";
import type { IPc } from "@/types/pc/pc";
import type { VolumeState } from "@/types/mqtt/pc-state";
import CommandIconButton from "@/components/button/command/command-icon-button";
import { Tooltip } from "@/components/ui/chakra/tooltip";
import { useExtracted } from "next-intl";

interface Props {
  pc: IPc;
  state: VolumeState;
  onMutedChange?: (muted: boolean) => void;
}

export default function MuteButton({ pc, state, onMutedChange }: Props) {
  const t = useExtracted("pc-slug-page.pc-state.volume-control.mute-button");

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
    <Tooltip
      content={
        state.muted
          ? t({
              message: "Unmute",
              description: "unmute tooltip",
            })
          : t({
              message: "Mute",
              description: "mute tooltip",
            })
      }
    >
      <CommandIconButton
        pc={pc}
        commandName={state.muted ? "unmute" : "mute"}
        variant="ghost"
        size="xs"
        onClick={() => onMutedChange?.(!state.muted)}
      >
        {icon}
      </CommandIconButton>
    </Tooltip>
  );
}
