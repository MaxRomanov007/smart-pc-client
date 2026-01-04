import AccentIcon from "@/components/ui/icon/accent-icon";
import RomanovDigitalMiniLogo from "@/components/icons/logo/romanov-digital/mini";
import SmartPCLogo from "@/components/icons/logo/smart-pc/full";
import { HStack } from "@chakra-ui/react";

export default function Logo() {
  return (
    <HStack gap={8} h={[4, null, 6, null, 8]}>
      <AccentIcon h="full" w="auto" hideBelow="md">
        <RomanovDigitalMiniLogo />
      </AccentIcon>

      <AccentIcon h="full" w="auto">
        <SmartPCLogo />
      </AccentIcon>
    </HStack>
  );
}
