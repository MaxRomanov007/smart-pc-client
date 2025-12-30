import type {Metadata} from 'next';
import {getExtracted} from "next-intl/server";
import {Button, HStack, Text} from "@chakra-ui/react";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getExtracted()

  return {
    title: t({
      message: "Index page",
      description: "title of index page in metadata",
    })
  }
}

export default async function LocalePage() {
  const t = await getExtracted()

  return (
    <HStack>
      <Text>
        {t({
          message: "Hello, {name}",
          values: {name: "John Doe"},
          description: "index page greeting",
        })}
      </Text>
      <Button>Hello</Button>
    </HStack>
  );
};