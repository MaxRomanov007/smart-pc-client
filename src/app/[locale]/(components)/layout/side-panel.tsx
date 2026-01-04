import { Separator, VStack } from "@chakra-ui/react";
import { NAVIGATION_TABS } from "@/config/navigation/tabs";
import NavigationTab from "@/app/[locale]/(components)/layout/navigation-tab";
import type { ComponentProps } from "react";

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
      <VStack as="nav" w="full">
        {NAVIGATION_TABS.map((tab) => (
          <NavigationTab key={tab.name} tab={tab} collapsed={!open} />
        ))}
      </VStack>
    </VStack>
  );
}
