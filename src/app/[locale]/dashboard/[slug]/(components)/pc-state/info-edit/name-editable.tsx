"use client";

import { Editable } from "@chakra-ui/react";
import EditableControl from "@/components/ui/editable/editable-control";
import type { IPc } from "@/types/pc/pc";
import { useCallback, useState } from "react";
import { useSecureAuth } from "@/utils/hooks/auth/client";
import { changeUserPc } from "@/services/pcs";
import { StatusCodes } from "@/types/services/response";
import { toaster } from "@/components/ui/chakra/toaster";
import { useExtracted } from "next-intl";
import { redirect } from "@/i18n/navigation";
import { PAGES } from "@/config/navigation/pages";

interface Props {
  pc: IPc;
}

export default function NameEditable({ pc }: Props) {
  const { token } = useSecureAuth();
  const t = useExtracted("slug-pc-name-editable");

  const [name, setName] = useState<string>(pc.name);

  const handleCommit = useCallback(async () => {
    const response = await changeUserPc(token, {
      id: pc.id,
      name,
    });

    if (response.status !== StatusCodes.ok) {
      setName(pc.name);
      toaster.info({
        title: t({
          message: "Error occurred while saving name",
          description: "error toast title",
        }),
        description: response.error?.toString(),
      });
      return;
    }

    if (response.data?.slug !== pc.slug) {
      redirect({ href: PAGES.pc(response.data?.slug ?? pc.slug), locale: "" });
    }
  }, [name, pc.id, pc.name, pc.slug, t, token]);

  return (
    <Editable.Root
      value={name}
      onValueChange={(e) => setName(e.value)}
      onValueCommit={async () => await handleCommit()}
    >
      <Editable.Preview />
      <Editable.Input />
      <EditableControl />
    </Editable.Root>
  );
}
