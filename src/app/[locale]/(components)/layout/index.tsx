"use client";

import { Box, Flex, Stack } from "@chakra-ui/react";
import { type ReactNode, useState } from "react";
import Header from "@/app/[locale]/(components)/layout/header";

export default function Layout({ children }: { children: ReactNode }) {
  const [isPanelOpen, setIsPanelOpen] = useState<boolean>(false);

  return (
    <Flex bgColor="bg.muted" w="full" h="100vh" p={2}>
      <Stack w="full" h="full">
        <Header isPanelOpen={isPanelOpen} setIsPanelOpen={setIsPanelOpen} />
        <Box bgColor="bg" w="full" h="full" rounded="md">
          {children}
        </Box>
      </Stack>
    </Flex>
  );
}
