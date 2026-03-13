import {
  AbsoluteCenter,
  Container,
  Heading,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";
import AccentIcon from "@/components/ui/icon/accent-icon";
import type { ReactNode } from "react";

interface Props {
  title?: string;
  description?: string;
  icon?: ReactNode;
  children?: ReactNode;
}

export default function NotificationPage({
  title,
  description,
  icon,
  children,
}: Props) {
  return (
    <AbsoluteCenter h="full">
      <Container maxW="sm">
        <VStack textAlign="center" gap={4}>
          {icon && (
            <AccentIcon w={24} h={24}>
              {icon}
            </AccentIcon>
          )}

          {title && <Heading as="h1">{title}</Heading>}

          {description && (
            <Text color="fg.muted" lineClamp={3}>
              {description}
            </Text>
          )}

          {children && <HStack>{children}</HStack>}
        </VStack>
      </Container>
    </AbsoluteCenter>
  );
}
