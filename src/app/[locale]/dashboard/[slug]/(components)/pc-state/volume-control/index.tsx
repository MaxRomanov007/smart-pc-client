"use client";

import { HStack } from "@chakra-ui/react";
import type { VolumeState } from "@/types/pc/pc-state";
import MuteButton from "@/app/[locale]/dashboard/[slug]/(components)/pc-state/volume-control/mute-button";
import type { IPc } from "@/types/pc/pc";
import VolumeSlider from "@/app/[locale]/dashboard/[slug]/(components)/pc-state/volume-control/volume-slider";
import TrackControlButtons from "@/app/[locale]/dashboard/[slug]/(components)/pc-state/volume-control/track-control-buttons";

interface Props {
  pc: IPc;
  state: VolumeState;
  onStateChange?: (volume: VolumeState) => void;
}

export default function VolumeControl({ pc, state, onStateChange }: Props) {
  return (
    <HStack w="full" pe={[null, null, null, "50px"]}>
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

      <TrackControlButtons pc={pc} />
    </HStack>
  );
}
