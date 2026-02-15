"use client";

import { Menu, Portal } from "@chakra-ui/react";
import { useExtracted } from "next-intl";
import ProfileButton from "@/components/button/auth/profile-button";
import ConfirmationDialogWithStore from "@/components/ui/dialog/confirmation-dialog/with-store";
import { useConfirmationDialog } from "@/utils/ui/dialogs/confirmation/useConfirmationDialog";
import type { SelectionDetails } from "@zag-js/menu";
import type { Session } from "next-auth";
import { signOut } from "next-auth/react";

interface Props {
  session: Session;
}

const MenuItemValues = {
  signOut: "sign-out",
} as const;

export default function ProfileMenu({ session }: Props) {
  const t = useExtracted("profile-button-menu");
  const confirmationDialog = useConfirmationDialog();

  const handleSignOut = async () => {
    await signOut();
  };

  const handleSelect = (details: SelectionDetails) => {
    switch (details.value) {
      case MenuItemValues.signOut:
        confirmationDialog.show(
          t({
            message: "Sign out of your account?",
            description: "confirmation dialog title for sign out action",
          }),
          t({
            message:
              "After sign out, you will be able to sign back into your account.",
            description: "confirmation dialog text for sign out action",
          }),
          handleSignOut,
        );
        break;
    }
  };

  return (
    <>
      <Menu.Root onSelect={handleSelect}>
        <Menu.Trigger asChild>
          <ProfileButton session={session} />
        </Menu.Trigger>
        <Portal>
          <Menu.Positioner>
            <Menu.Content>
              <Menu.Item value={MenuItemValues.signOut}>
                {t({
                  message: "Sign Out",
                  description: "user menu sign out text",
                })}
              </Menu.Item>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>
      <ConfirmationDialogWithStore store={confirmationDialog} />
    </>
  );
}
