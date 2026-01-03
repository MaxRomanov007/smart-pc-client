import type { Metadata } from "next";
import { AbsoluteCenter } from "@chakra-ui/react";
import SignInButton from "@/app/[locale]/(components)/sign-in-button";

export const metadata: Metadata = {
  title: "Unauthorized",
};

export default function UnauthorizedPage() {
  return (
    <AbsoluteCenter>
      <SignInButton />
    </AbsoluteCenter>
  );
}
