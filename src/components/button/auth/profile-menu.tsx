"use client";

import { Menu, Portal } from "@chakra-ui/react";
import { useExtracted } from "next-intl";
import ProfileButton from "@/components/button/auth/profile-button";
import ConfirmationDialogWithStore from "@/components/ui/dialog/confirmation-dialog/with-store";
import { useConfirmationDialog } from "@/utils/hooks/ui/dialogs/confirmation/useConfirmationDialog";
import type { SelectionDetails } from "@zag-js/menu";
import { useAuth } from "@/lib/auth/use-auth";
import { useRouter } from "@/i18n/navigation";

const MenuItemValues = {
  editAccount: "edit-account",
  signOut: "sign-out",
} as const;

const SETTINGS_URL =
  process.env.NEXT_PUBLIC_KRATOS_SELFSERVICE_URL + "/settings";

export default function ProfileMenu() {
  const t = useExtracted("profile-button-menu");
  const confirmationDialog = useConfirmationDialog();
  const { logout, user } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await logout();
  };

  const handleSelect = (details: SelectionDetails) => {
    switch (details.value) {
      case MenuItemValues.editAccount:
        router.push(SETTINGS_URL);
        break;
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
              <Menu.Item value={MenuItemValues.editAccount}>
                {t({
                  message: "Edit Account",
                  description: "user menu edit account text",
                })}
              </Menu.Item>
              <Menu.Item value={MenuItemValues.signOut} color={"fg.error"}>
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
