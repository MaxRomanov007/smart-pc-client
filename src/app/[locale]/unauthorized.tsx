import type { Metadata } from "next";
import { AbsoluteCenter } from "@chakra-ui/react";
import SignInButton from "@/components/button/sign-in-button";

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
