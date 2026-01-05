"use client";

import { type Button, Skeleton } from "@chakra-ui/react";
import { authClient } from "@/utils/auth/client";
import SignInButton from "./sign-in-button";
import type { ComponentProps } from "react";
import ProfileMenu from "@/components/button/auth/profile-menu";

type Props = ComponentProps<typeof Button>;

export default function UserButton(props: Props) {
  const { data, isPending, error } = authClient.useSession();
  const isAuthorized = !!data && !error;

  return (
    <Skeleton loading={isPending}>
      {isAuthorized ? (
        <ProfileMenu user={data.user} {...props} />
      ) : (
        <SignInButton {...props} />
      )}
    </Skeleton>
  );
}
