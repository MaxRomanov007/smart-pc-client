import { Grid, GridItem } from "@chakra-ui/react";
import UserButton from "@/components/button/auth/user-button";
import Logo from "@/app/[locale]/(components)/layout/logo";
import FunctionalBlock from "@/app/[locale]/(components)/layout/functional-block";

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
        <FunctionalBlock
          isPanelOpen={isPanelOpen}
          setIsPanelOpen={setIsPanelOpen}
        />
      </GridItem>

      <GridItem>
        <Logo />
      </GridItem>

      <GridItem justifySelf="end">
        <UserButton />
      </GridItem>
    </Grid>
  );
}
