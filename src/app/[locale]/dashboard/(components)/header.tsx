import { getExtracted } from "next-intl/server";
import { Heading, Stack, Text } from "@chakra-ui/react";

export default async function Header() {
  const t = await getExtracted("dashboard-page-header");

  return (
    <Stack gap={1}>
      <Heading size="3xl" as="h1">
        {t({
          message: "My PCs",
          description: "title",
        })}
      </Heading>
      <Text color="fg.muted">
        {t({
          message: "Manage your registered computers",
          description: "description",
        })}
      </Text>
    </Stack>
  );
}
