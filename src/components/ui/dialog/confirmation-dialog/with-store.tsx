import { type ComponentProps } from "react";
import type { UseConfirmationDialogType } from "@/utils/hooks/ui/dialogs/confirmation/useConfirmationDialog";
import ConfirmationDialog from "@/components/ui/dialog/confirmation-dialog/dialog";

interface ConfirmationDialogWithStoreProps extends Omit<
  ComponentProps<typeof ConfirmationDialog>,
  "onConfirm" | "title" | "content" | "open" | "onOpenChange"
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
      content={store.state.content}
      title={store.state.title}
      onConfirm={store.state.onConfirm}
      {...props}
    />
  );
}
