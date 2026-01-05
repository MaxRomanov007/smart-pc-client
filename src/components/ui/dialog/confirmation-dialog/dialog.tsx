import { Dialog, Portal } from "@chakra-ui/react";
import {
  type ComponentProps,
  type MouseEventHandler,
  type ReactNode,
} from "react";
import Content from "./content";

interface ConfirmationDialogProps extends Omit<
  ComponentProps<typeof Dialog.Root>,
  "children"
> {
  withoutPortal?: boolean;
  children?: ReactNode;
  title?: string;
  text?: string;
  onConfirm?: MouseEventHandler<HTMLButtonElement>;
}

export default function ConfirmationDialog({
  withoutPortal,
  children,
  title,
  text,
  onConfirm,
  ...props
}: ConfirmationDialogProps) {
  return (
    <Dialog.Root size={{ mdDown: "full", md: "lg" }} {...props}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>

      {withoutPortal ? (
        <Content title={title} text={text} onConfirm={onConfirm} />
      ) : (
        <Portal>
          <Content title={title} text={text} onConfirm={onConfirm} />
        </Portal>
      )}
    </Dialog.Root>
  );
}
