"use client";

import { HStack } from "@chakra-ui/react";
import type { VolumeState } from "@/types/mqtt/pc-state";
import MuteButton from "@/app/[locale]/dashboard/[slug]/(components)/pc-state/volume-control/mute-button";
import type { IPc } from "@/types/pc/pc";
import VolumeSlider from "@/app/[locale]/dashboard/[slug]/(components)/pc-state/volume-control/volume-slider";

interface Props {
  pc: IPc;
  state: VolumeState;
  onStateChange?: (volume: VolumeState) => void;
}

export default function VolumeControl({ pc, state, onStateChange }: Props) {
  return (
    <HStack>
      <MuteButton
        pc={pc}
        state={state}
        onMutedChange={(muted) => onStateChange?.({ ...state, muted: muted })}
      />

      <VolumeSlider
        pc={pc}
        state={state}
        onVolumeChange={(volume) =>
          onStateChange?.({ ...state, current: volume })
        }
      />
    </HStack>
  );
}
