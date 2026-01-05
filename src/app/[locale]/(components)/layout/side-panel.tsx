import { Separator, VStack } from "@chakra-ui/react";
import type { ComponentProps } from "react";
import TabList from "@/app/[locale]/(components)/layout/tab-list";

interface Props extends ComponentProps<typeof VStack> {
  open: boolean;
}

export default function SidePanel({ open, ...props }: Props) {
  return (
    <VStack
      as="aside"
      w={open ? 48 : 11}
      transition="width 0.2s ease-in-out"
      overflow="hidden"
      {...props}
    >
      <Separator w="full" />
      <TabList collapsed={!open} />
    </VStack>
  );
}
