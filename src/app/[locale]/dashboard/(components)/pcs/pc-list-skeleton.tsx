import PcListGrid from "@/components/pc/pc-list-grid";
import { Skeleton } from "@chakra-ui/react";
import PcCard from "@/components/pc/pc-card";

export default function PcListSkeleton() {
  const mockPC = {
    canPowerOn: false,
    id: "loading",
    slug: "loading",
    online: false,
    name: "loading",
    description:
      "loading loading loading loading loading loading loading loading loading",
  };

  return (
    <PcListGrid>
      <Skeleton>
        <PcCard pc={mockPC} />
      </Skeleton>
      <Skeleton>
        <PcCard pc={mockPC} />
      </Skeleton>
      <Skeleton>
        <PcCard pc={mockPC} />
      </Skeleton>
    </PcListGrid>
  );
}
