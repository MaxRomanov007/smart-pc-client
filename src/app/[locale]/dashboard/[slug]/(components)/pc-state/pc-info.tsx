"use client";

import { Editable, Field, Stack } from "@chakra-ui/react";
import type { IPc } from "@/types/pc/pc";
import { useExtracted } from "next-intl";
import EditableControl from "@/components/ui/editable/editable-control";
import type { VolumeState } from "@/types/mqtt/pc-state";
import VolumeControl from "@/app/[locale]/dashboard/[slug]/(components)/pc-state/volume-control";

interface Props {
  pc: IPc;
  volumeState?: VolumeState;
  onVolumeChange?: (volume: VolumeState) => void;
}

export function PcInfo({ pc, volumeState, onVolumeChange }: Props) {
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
        <Editable.Root defaultValue={pc.name}>
          <Editable.Preview />
          <Editable.Input />
          <EditableControl />
        </Editable.Root>
      </Field.Root>

      <Field.Root orientation="horizontal">
        <Field.Label>
          {t({
            message: "Description:",
            description: "pc description label",
          })}
        </Field.Label>
        <Editable.Root defaultValue={pc.description}>
          <Editable.Preview />
          <Editable.Textarea />
          <EditableControl />
        </Editable.Root>
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
