import { Text } from "@chakra-ui/react";
import type { ComponentProps } from "react";

export default function ValueText(props: ComponentProps<typeof Text>) {
  return <Text maxW={300} lineClamp={3} {...props} />;
}
