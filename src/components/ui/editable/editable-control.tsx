"use client";

import { Editable, IconButton } from "@chakra-ui/react";
import { LuCheck, LuPencilLine, LuX } from "react-icons/lu";
import { Tooltip } from "@/components/ui/chakra/tooltip";
import { useExtracted } from "next-intl";

export default function EditableControl() {
  const t = useExtracted("components.ui.editable-control");

  return (
    <Editable.Control>
      <Tooltip
        content={t({
          message: "Edit",
          description: "edit button tooltip",
        })}
      >
        <Editable.EditTrigger asChild>
          <IconButton variant="ghost" size="xs">
            <LuPencilLine />
          </IconButton>
        </Editable.EditTrigger>
      </Tooltip>

      <Tooltip
        content={t({
          message: "Cancel",
          description: "cancel button tooltip",
        })}
      >
        <Editable.CancelTrigger asChild>
          <IconButton variant="outline" size="xs">
            <LuX />
          </IconButton>
        </Editable.CancelTrigger>
      </Tooltip>

      <Tooltip
        content={t({
          message: "Submit",
          description: "submit button tooltip",
        })}
      >
        <Editable.SubmitTrigger asChild>
          <IconButton variant="outline" size="xs">
            <LuCheck />
          </IconButton>
        </Editable.SubmitTrigger>
      </Tooltip>
    </Editable.Control>
  );
}
