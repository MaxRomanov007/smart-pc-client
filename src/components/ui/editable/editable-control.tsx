import { Editable, IconButton } from "@chakra-ui/react";
import { LuCheck, LuPencilLine, LuX } from "react-icons/lu";

export default function EditableControl() {
  return (
    <Editable.Control>
      <Editable.EditTrigger asChild>
        <IconButton variant="ghost" size="xs">
          <LuPencilLine />
        </IconButton>
      </Editable.EditTrigger>
      <Editable.CancelTrigger asChild>
        <IconButton variant="outline" size="xs">
          <LuX />
        </IconButton>
      </Editable.CancelTrigger>
      <Editable.SubmitTrigger asChild>
        <IconButton variant="outline" size="xs">
          <LuCheck />
        </IconButton>
      </Editable.SubmitTrigger>
    </Editable.Control>
  );
}
