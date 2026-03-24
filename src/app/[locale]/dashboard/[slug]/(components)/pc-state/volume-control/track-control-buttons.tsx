"use client";

import CommandIconButton from "@/components/button/command/command-icon-button";
import { LuArrowLeftToLine, LuArrowRightToLine } from "react-icons/lu";
import { PiPlayPauseBold } from "react-icons/pi";
import { ButtonGroup } from "@chakra-ui/react";
import { Tooltip } from "@/components/ui/chakra/tooltip";
import type { IPc } from "@/types/pc/pc";
import { useExtracted } from "next-intl";

interface Props {
  pc: IPc;
}

export default function TrackControlButtons({ pc }: Props) {
  const t = useExtracted(
    "slug-pc-page.pc-state.volume-control.track-control-buttons",
  );

  return (
    <ButtonGroup variant="ghost" size="xs" attached>
      <Tooltip
        content={t({
          message: "Previous track",
          description: "previous track button",
        })}
      >
        <CommandIconButton
          opts={{
            pc: pc,
            commandId: "prev-track",
            withoutDialog: true,
          }}
        >
          <LuArrowLeftToLine />
        </CommandIconButton>
      </Tooltip>

      <Tooltip
        content={t({
          message: "Play / Pause",
          description: "play-pause button",
        })}
      >
        <CommandIconButton
          opts={{
            pc: pc,
            commandId: "play-pause",
            withoutDialog: true,
          }}
        >
          <PiPlayPauseBold />
        </CommandIconButton>
      </Tooltip>

      <Tooltip
        content={t({
          message: "Next track",
          description: "next track button",
        })}
      >
        <CommandIconButton
          opts={{
            pc: pc,
            commandId: "next-track",
            withoutDialog: true,
          }}
        >
          <LuArrowRightToLine />
        </CommandIconButton>
      </Tooltip>
    </ButtonGroup>
  );
}
