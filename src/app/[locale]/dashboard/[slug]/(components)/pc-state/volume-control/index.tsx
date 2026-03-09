"use client";

import { ButtonGroup, HStack } from "@chakra-ui/react";
import type { VolumeState } from "@/types/mqtt/pc-state";
import MuteButton from "@/app/[locale]/dashboard/[slug]/(components)/pc-state/volume-control/mute-button";
import type { IPc } from "@/types/pc/pc";
import VolumeSlider from "@/app/[locale]/dashboard/[slug]/(components)/pc-state/volume-control/volume-slider";
import CommandIconButton from "@/components/button/command/command-icon-button";
import { PiPlayPauseBold } from "react-icons/pi";
import { LuArrowLeftToLine, LuArrowRightToLine } from "react-icons/lu";

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

      <ButtonGroup variant="ghost" size="xs" attached>
        <CommandIconButton pc={pc} commandName="prev-track">
          <LuArrowLeftToLine />
        </CommandIconButton>

        <CommandIconButton pc={pc} commandName="play-pause">
          <PiPlayPauseBold />
        </CommandIconButton>

        <CommandIconButton pc={pc} commandName="next-track">
          <LuArrowRightToLine />
        </CommandIconButton>
      </ButtonGroup>
    </HStack>
  );
}
