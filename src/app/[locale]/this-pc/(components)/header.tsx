import { getExtracted } from "next-intl/server";
import { Heading, Stack, Text } from "@chakra-ui/react";

export default async function Header() {
  const t = await getExtracted("this-pc-page-header");

  return (
    <Stack gap={1}>
      <Heading size="3xl" as="h1">
        {t({
          message: "My commands",
          description: "title",
        })}
      </Heading>
      <Text color="fg.muted">
        {t({
          message: "Here you can add/edit your commands registered on this PC",
          description: "description",
        })}
      </Text>
    </Stack>
  );
}
