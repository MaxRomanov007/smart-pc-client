"use client";

import { Field, Stack } from "@chakra-ui/react";
import type { IPc } from "@/types/pc/pc";
import { useExtracted } from "next-intl";
import type { VolumeState } from "@/types/pc/pc-state";
import VolumeControl from "@/app/[locale]/dashboard/[slug]/(components)/pc-state/volume-control";
import NameEditable from "@/app/[locale]/dashboard/[slug]/(components)/pc-state/info-edit/name-editable";
import DescriptionEditable from "./info-edit/description-editable";

interface Props {
  pc: IPc;
  volumeState?: VolumeState;
  onVolumeChange?: (volume: VolumeState) => void;
  onPcChange?: (volume: IPc) => void;
}

export function PcInfo({ pc, volumeState, onVolumeChange, onPcChange }: Props) {
  const t = useExtracted("slug-pc-info");

  return (
    <Stack w="full">
      <Field.Root orientation="horizontal">
        <Field.Label>
          {t({
            message: "Name:",
            description: "pc name label",
          })}
        </Field.Label>
        <NameEditable pc={pc} />
      </Field.Root>

      <Field.Root orientation="horizontal">
        <Field.Label>
          {t({
            message: "Description:",
            description: "pc description label",
          })}
        </Field.Label>
        <DescriptionEditable
          pc={pc}
          onDescriptionChanged={(description) =>
            onPcChange?.({ ...pc, description })
          }
        />
      </Field.Root>

      {volumeState && (
        <VolumeControl
          pc={pc}
          state={volumeState}
          onStateChange={onVolumeChange}
        />
      )}
    </Stack>
  );
}
