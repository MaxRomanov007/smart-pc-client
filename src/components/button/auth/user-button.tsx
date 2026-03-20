"use client";

import { type Button, Skeleton } from "@chakra-ui/react";
import SignInButton from "./sign-in-button";
import type { ComponentProps } from "react";
import ProfileMenu from "@/components/button/auth/profile-menu";
import { useAuth } from "@/lib/auth/use-auth";

type Props = ComponentProps<typeof Button>;

export default function UserButton(props: Props) {
  const { user, isLoading, isAuthenticated } = useAuth();

  return (
    <Skeleton loading={isLoading}>
      {isAuthenticated && user ? (
        <ProfileMenu {...props} />
      ) : (
        <SignInButton {...props} />
      )}
    </Skeleton>
  );
}
