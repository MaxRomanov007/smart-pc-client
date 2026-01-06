import type { Metadata } from "next";
import { getExtracted } from "next-intl/server";
import { Box } from "@chakra-ui/react";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getExtracted();

  return {
    title: t({
      message: "Index page",
      description: "title of index page in metadata",
    }),
  };
}

export default async function MainPage() {
  return <Box w={1000} h={1000} bgColor="red"></Box>;
}
