import { LuPlus } from "react-icons/lu";
import { IconButton } from "@chakra-ui/react";
import type { ComponentProps } from "react";

export default function AddButton(
  props: Omit<ComponentProps<typeof IconButton>, "children">,
) {
  return (
    <IconButton {...props}>
      <LuPlus />
    </IconButton>
  );
}
