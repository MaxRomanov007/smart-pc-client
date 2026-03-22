"use client";

import { Editable, Textarea } from "@chakra-ui/react";
import EditableControl from "@/components/ui/editable/editable-control";
import type { IPc } from "@/types/pc/pc";
import { useCallback, useState } from "react";
import { changeUserPc } from "@/services/pcs";
import { StatusCodes } from "@/types/api/response";
import { toaster } from "@/components/ui/chakra/toaster";
import { useExtracted } from "next-intl";
import { useRequireAuth } from "@/lib/auth/use-auth";

interface Props {
  pc: IPc;
  onDescriptionChanged: (description: string) => void;
}

export default function DescriptionEditable({
  pc,
  onDescriptionChanged,
}: Props) {
  const { accessToken } = useRequireAuth();
  const t = useExtracted("slug-pc-description-editable");

  const [description, setDescription] = useState<string>(pc.description);

  const handleCommit = useCallback(async () => {
    const response = await changeUserPc(accessToken ?? "", {
      id: pc.id,
      description,
    });

    if (response.status !== StatusCodes.ok) {
      setDescription(pc.description);
      toaster.info({
        title: t({
          message: "Error occurred while saving description",
          description: "error toast title",
        }),
        description: response.error?.toString(),
      });
      return;
    }

    onDescriptionChanged?.(description);
  }, [
    description,
    onDescriptionChanged,
    pc.description,
    pc.id,
    t,
    accessToken,
  ]);

  return (
    <Editable.Root
      value={description}
      onValueChange={(e) => setDescription(e.value)}
      onValueCommit={async () => await handleCommit()}
    >
      <Editable.Preview lineClamp={5} wordBreak="break-word" />
      <Editable.Textarea asChild>
        <Textarea autoresize maxHeight="5lh" />
      </Editable.Textarea>
      <EditableControl />
    </Editable.Root>
  );
}
