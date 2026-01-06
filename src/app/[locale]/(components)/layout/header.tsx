import { Grid, GridItem } from "@chakra-ui/react";
import Logo from "@/app/[locale]/(components)/layout/logo";
import FunctionalBlockLeft from "@/app/[locale]/(components)/layout/functional-block-left";
import FunctionalBlockRight from "@/app/[locale]/(components)/layout/functional-block-right";

interface Props {
  setIsPanelOpen: (open: boolean) => void;
  isPanelOpen: boolean;
}

export default function Header({ isPanelOpen, setIsPanelOpen }: Props) {
  return (
    <Grid
      as="header"
      templateColumns="1fr auto 1fr"
      my={1}
      alignItems={"center"}
    >
      <GridItem>
        <FunctionalBlockLeft
          isPanelOpen={isPanelOpen}
          setIsPanelOpen={setIsPanelOpen}
        />
      </GridItem>

      <GridItem>
        <Logo />
      </GridItem>

      <GridItem justifySelf="end">
        <FunctionalBlockRight />
      </GridItem>
    </Grid>
  );
}
