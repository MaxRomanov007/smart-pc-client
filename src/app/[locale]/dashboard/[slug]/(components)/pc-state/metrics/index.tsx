import { Flex } from "@chakra-ui/react";
import CpuMetric from "@/app/[locale]/dashboard/[slug]/(components)/pc-state/metrics/cpu-metric";
import RamMetric from "@/app/[locale]/dashboard/[slug]/(components)/pc-state/metrics/ram-metric";
import type { VirtualMemoryState } from "@/types/mqtt/pc-state";

interface Props {
  cpuPercent: number;
  virtualMemory: VirtualMemoryState;
}

export default function Metrics({ cpuPercent, virtualMemory }: Props) {
  return (
    <Flex w="full" direction={["column", "row"]}>
      <CpuMetric percent={cpuPercent} />

      <RamMetric
        total={virtualMemory.total}
        available={virtualMemory.available}
      />
    </Flex>
  );
}
