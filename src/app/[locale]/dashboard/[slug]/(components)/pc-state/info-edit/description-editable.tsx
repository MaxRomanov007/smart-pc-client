"use client";

import { Editable, Textarea } from "@chakra-ui/react";
import EditableControl from "@/components/ui/editable/editable-control";
import type { IPc } from "@/types/pc/pc";
import { useCallback, useState } from "react";
import { useEditPcMutation } from "@/utils/hooks/queries/pcs";

interface Props {
  pc: IPc;
  onDescriptionChanged: (description: string) => void;
}

export default function DescriptionEditable({
  pc,
  onDescriptionChanged,
}: Props) {
  const [description, setDescription] = useState<string>(pc.description);

  const { mutate } = useEditPcMutation(pc.id);

  const handleCommit = useCallback(() => {
    if (description === pc.description) {
      return;
    }

    mutate({ ...pc, description });

    onDescriptionChanged?.(description);
  }, [description, pc, mutate, onDescriptionChanged]);

  return (
    <Editable.Root
      value={description}
      onValueChange={(e) => setDescription(e.value)}
      onValueCommit={handleCommit}
    >
      <Editable.Preview lineClamp={5} wordBreak="break-word" />
      <Editable.Textarea asChild>
        <Textarea autoresize maxHeight="5lh" />
      </Editable.Textarea>
      <EditableControl />
    </Editable.Root>
  );
}
