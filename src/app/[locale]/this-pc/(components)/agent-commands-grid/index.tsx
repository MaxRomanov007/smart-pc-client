import type { ComponentProps } from "react";
import { Grid } from "@chakra-ui/react";

export default function AgentCommandsGrid({
  children,
  ...props
}: ComponentProps<typeof Grid>) {
  return (
    <Grid
      gap={4}
      templateColumns="repeat(auto-fit, minmax(360px, 1fr))"
      {...props}
    >
      {children}
    </Grid>
  );
}
