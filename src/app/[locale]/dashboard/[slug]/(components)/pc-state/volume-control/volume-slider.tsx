"use client";

import type { VolumeState } from "@/types/mqtt/pc-state";
import type { IPc } from "@/types/pc/pc";
import { useCommands } from "@/utils/hooks/commands/hook";
import { Slider } from "@chakra-ui/react";
import { ParameterTypes } from "@/types/pc/command-parameter";
import { useState } from "react";

interface Props {
  pc: IPc;
  state: VolumeState;
  onVolumeChange?: (volume: number) => void;
}

export default function VolumeSlider({ pc, state, onVolumeChange }: Props) {
  const { doCommand } = useCommands();
  const [localVolume, setLocalVolume] = useState<number | null>(null);

  const displayValue = localVolume ?? state.current ?? 100;

  const handleChange = (volume: number) => {
    setLocalVolume(volume);
    onVolumeChange?.(volume);
  };

  const handleChangeEnd = (volume: number) => {
    setLocalVolume(null);

    doCommand({
      pc,
      name: "set-volume",
      withoutDialog: true,
      params: [
        {
          id: "",
          description: "",
          name: "volume",
          type: ParameterTypes.number,
          value: volume,
        },
      ],
    });
  };

  return (
    <Slider.Root
      w={["full", "200px"]}
      value={[displayValue]}
      onValueChange={(e) => handleChange(e.value[0])}
      onValueChangeEnd={(e) => handleChangeEnd(e.value[0])}
    >
      <Slider.Control>
        <Slider.Track>
          <Slider.Range />
        </Slider.Track>
        <Slider.Thumb index={0}>
          <Slider.DraggingIndicator
            layerStyle="fill.solid"
            top="6"
            rounded="sm"
            px="1.5"
          >
            <Slider.ValueText />
          </Slider.DraggingIndicator>
        </Slider.Thumb>
      </Slider.Control>
    </Slider.Root>
  );
}
