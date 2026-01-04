"use client";

import { Skeleton } from "@chakra-ui/react";
import { authClient } from "@/utils/auth/client";
import SignInButton from "./sign-in-button";
import ProfileButton from "@/components/button/auth/profile-button";

export default function UserButton() {
  const { data, isPending, error } = authClient.useSession();
  const isAuthorized = !!data && !error;

  return (
    <Skeleton loading={isPending}>
      {isAuthorized ? <ProfileButton user={data.user} /> : <SignInButton />}
    </Skeleton>
  );
}
