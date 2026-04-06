import { LuTrash2 } from "react-icons/lu";
import { IconButton } from "@chakra-ui/react";
import type { ComponentProps } from "react";

export default function DeleteButton(props: ComponentProps<typeof IconButton>) {
  return (
    <IconButton variant="ghost" colorPalette="red" {...props}>
      <LuTrash2 />
    </IconButton>
  );
}
