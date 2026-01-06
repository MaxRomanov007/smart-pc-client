import { ColorModeButton } from "@/components/ui/chakra/color-mode";
import { HStack } from "@chakra-ui/react";
import UserButton from "@/components/button/auth/user-button";

export default function FunctionalBlockRight() {
  return (
    <HStack gap={[1, null, 2]}>
      <ColorModeButton size="sm" hideFrom="md" />
      <UserButton />
    </HStack>
  );
}
