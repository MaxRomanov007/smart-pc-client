import { type Button, Dialog, Portal } from "@chakra-ui/react";
import {
  type ComponentProps,
  type MouseEventHandler,
  type ReactNode,
} from "react";
import Content from "./content";
import { Tooltip } from "@/components/ui/chakra/tooltip";

interface ConfirmationDialogProps extends Omit<
  ComponentProps<typeof Dialog.Root>,
  "children"
> {
  withoutPortal?: boolean;
  children?: ReactNode;
  title?: string;
  content?: string | ReactNode;
  onConfirm?: MouseEventHandler<HTMLButtonElement>;
  tooltip?: ReactNode;
  confirmButtonProps?: ComponentProps<typeof Button>;
  cancelButtonProps?: ComponentProps<typeof Button>;
}

export default function ConfirmationDialog({
  withoutPortal,
  children,
  title,
  content,
  onConfirm,
  tooltip,
  confirmButtonProps,
  cancelButtonProps,
  ...props
}: ConfirmationDialogProps) {
  return (
    <Dialog.Root size={{ mdDown: "full", md: "lg" }} {...props}>
      <Tooltip content={tooltip}>
        <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      </Tooltip>

      {withoutPortal ? (
        <Content
          title={title}
          content={content}
          confirmButtonProps={confirmButtonProps}
          cancelButtonProps={cancelButtonProps}
          onConfirm={onConfirm}
        />
      ) : (
        <Portal>
          <Content
            title={title}
            content={content}
            confirmButtonProps={confirmButtonProps}
            cancelButtonProps={cancelButtonProps}
            onConfirm={onConfirm}
          />
        </Portal>
      )}
    </Dialog.Root>
  );
}
