import { type ComponentProps } from "react";
import type { UseConfirmationDialogType } from "@/utils/ui/dialogs/confirmation/client";
import ConfirmationDialog from "@/components/ui/dialog/confirmation-dialog/dialog";

interface ConfirmationDialogWithStoreProps extends Omit<
  ComponentProps<typeof ConfirmationDialog>,
  "onConfirm" | "title" | "text" | "open" | "onOpenChange"
> {
  store: UseConfirmationDialogType;
}

export default function ConfirmationDialogWithStore({
  store,
  ...props
}: ConfirmationDialogWithStoreProps) {
  return (
    <ConfirmationDialog
      open={store.state.open}
      onOpenChange={(d) =>
        store.setState((prevState) => ({
          ...prevState,
          open: d.open,
        }))
      }
      text={store.state.text}
      title={store.state.title}
      onConfirm={store.state.onConfirm}
      {...props}
    />
  );
}
