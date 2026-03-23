"use client";

import { Editable } from "@chakra-ui/react";
import EditableControl from "@/components/ui/editable/editable-control";
import type { IPc } from "@/types/pc/pc";
import { useCallback, useState } from "react";
import { useEditPcMutation } from "@/utils/hooks/queries/pcs";

interface Props {
  pc: IPc;
}

export default function NameEditable({ pc }: Props) {
  const [name, setName] = useState<string>(pc.name);

  const { mutate } = useEditPcMutation(pc.id);

  const handleCommit = useCallback(() => {
    if (name === pc.name) {
      return;
    }
    mutate({ ...pc, name });
  }, [name, pc, mutate]);

  return (
    <Editable.Root
      value={name}
      onValueChange={(e) => setName(e.value)}
      onValueCommit={handleCommit}
    >
      <Editable.Preview />
      <Editable.Input />
      <EditableControl />
    </Editable.Root>
  );
}
