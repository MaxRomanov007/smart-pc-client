"use client";

import { HStack, Stack } from "@chakra-ui/react";
import { type ReactNode, useState } from "react";
import Header from "@/app/[locale]/(components)/layout/header";
import SidePanel from "@/app/[locale]/(components)/layout/side-panel";
import PageScrollArea from "@/app/[locale]/(components)/layout/page-scroll-area";

export default function Layout({ children }: { children: ReactNode }) {
  const [isPanelOpen, setIsPanelOpen] = useState<boolean>(false);

  return (
    <Stack bgColor="bg.muted" w="full" h="100vh" p={2}>
      <Header isPanelOpen={isPanelOpen} setIsPanelOpen={setIsPanelOpen} />

      <HStack h="full" alignItems="start" minH={0}>
        <SidePanel open={isPanelOpen} hideBelow="md" />
        <PageScrollArea bgColor="bg" w="full" h="full" rounded="md">
          {children}
        </PageScrollArea>
      </HStack>
    </Stack>
  );
}
