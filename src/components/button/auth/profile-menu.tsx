"use client";

import { Menu, Portal } from "@chakra-ui/react";
import { useExtracted } from "next-intl";
import ProfileButton from "@/components/button/auth/profile-button";
import ConfirmationDialogWithStore from "@/components/ui/dialog/confirmation-dialog/with-store";
import { useConfirmationDialog } from "@/utils/ui/dialogs/confirmation/useConfirmationDialog";
import type { SelectionDetails } from "@zag-js/menu";
import { useAuth } from "@/utils/hooks/auth";

const MenuItemValues = {
  signOut: "sign-out",
} as const;

export default function ProfileMenu() {
  const t = useExtracted("profile-button-menu");
  const confirmationDialog = useConfirmationDialog();
  const { logOut, user } = useAuth();

  const handleSignOut = async () => {
    logOut();
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
          {user && <ProfileButton user={user} />}
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
