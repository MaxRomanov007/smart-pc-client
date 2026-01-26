import type { ReactNode } from "react";
import { Center, Grid } from "@chakra-ui/react";

interface Props {
  children?: ReactNode;
  empty?: boolean;
}

export default function PcListGrid({ children, empty }: Props) {
  if (empty) {
    return <Center>{children}</Center>;
  }

  return (
    <Grid
      templateColumns={["1fr", "repeat(auto-fill, minmax(360px, 1fr))"]}
      gap={4}
    >
      {children}
    </Grid>
  );
}
