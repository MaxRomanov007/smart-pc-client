"use client";

import { type Button, Skeleton } from "@chakra-ui/react";
import SignInButton from "./sign-in-button";
import type { ComponentProps } from "react";
import ProfileMenu from "@/components/button/auth/profile-menu";
import { useSession } from "next-auth/react";

type Props = ComponentProps<typeof Button>;

export default function UserButton(props: Props) {
  const { data, status } = useSession();

  return (
    <Skeleton loading={status === "loading"}>
      {status === "authenticated" && data?.user ? (
        <ProfileMenu session={data} {...props} />
      ) : (
        <SignInButton {...props} />
      )}
    </Skeleton>
  );
}
