import { CloseButton, Drawer, IconButton, Portal } from "@chakra-ui/react";
import { LuMenu } from "react-icons/lu";
import { useExtracted } from "next-intl";
import { type ComponentProps, useState } from "react";
import TabList from "@/app/[locale]/(components)/layout/tab-list";

type Props = ComponentProps<typeof IconButton>;

export default function MenuDrawer(props: Props) {
  const t = useExtracted();
  const [open, setOpen] = useState(false);

  const handleTabSelect = () => {
    setOpen(false);
  };

  return (
    <Drawer.Root
      placement="bottom"
      open={open}
      onOpenChange={(d) => setOpen(d.open)}
    >
      <Drawer.Trigger asChild>
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
              <TabList onSelect={handleTabSelect} />
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
