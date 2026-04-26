import { LuTrash2 } from "react-icons/lu";
import { IconButton } from "@chakra-ui/react";
import type { ComponentProps } from "react";

export default function DeleteButton(
  props: Omit<ComponentProps<typeof IconButton>, "children">,
) {
  return (
    <IconButton variant="subtle" colorPalette="red" {...props}>
      <LuTrash2 />
    </IconButton>
  );
}
