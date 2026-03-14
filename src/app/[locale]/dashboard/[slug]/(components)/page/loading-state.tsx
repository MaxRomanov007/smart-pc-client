import { Flex, Skeleton } from "@chakra-ui/react";

export default function LoadingState() {
  return (
    <Flex gap={4} h="90vh" direction="column">
      <Skeleton h="20vh" />
      <Flex flexGrow={1} direction="row" gap={4}>
        <Skeleton flexGrow={1} />
        <Skeleton flexGrow={1} />
      </Flex>
    </Flex>
  );
}
