import {
  CloseButton,
  Drawer,
  IconButton,
  Portal,
  VStack,
} from "@chakra-ui/react";
import { LuMenu } from "react-icons/lu";
import { useExtracted } from "next-intl";
import { NAVIGATION_TABS } from "@/config/navigation/tabs";
import NavigationTab from "@/app/[locale]/(components)/layout/navigation-tab";
import type { ComponentProps } from "react";

type Props = ComponentProps<typeof IconButton>;

export default function MenuDrawer(props: Props) {
  const t = useExtracted();

  return (
    <Drawer.Root placement="bottom">
      <Drawer.Trigger>
        <IconButton size="sm" variant="ghost" {...props}>
          <LuMenu />
        </IconButton>
      </Drawer.Trigger>
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header>
              {t({
                message: "Menu",
                description: "navigation menu title in the drawer",
              })}
            </Drawer.Header>
            <Drawer.Body>
              <VStack as="nav">
                {NAVIGATION_TABS.map((tab) => (
                  <NavigationTab key={tab.name} tab={tab} />
                ))}
              </VStack>
            </Drawer.Body>
            <Drawer.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Drawer.CloseTrigger>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
}
