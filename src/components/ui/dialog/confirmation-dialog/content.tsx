"use client";

import { Button, CloseButton, Dialog, Text } from "@chakra-ui/react";
import {
  type ComponentProps,
  type MouseEventHandler,
  type ReactNode,
} from "react";
import { useExtracted } from "next-intl";

interface Props {
  title?: string;
  content?: string | ReactNode;
  onConfirm?: MouseEventHandler<HTMLButtonElement>;
  confirmButtonProps?: ComponentProps<typeof Button>;
  cancelButtonProps?: ComponentProps<typeof Button>;
}

export default function Content({
  title,
  content,
  onConfirm,
  confirmButtonProps,
  cancelButtonProps,
}: Props) {
  const t = useExtracted("confirmation-dialog");

  return (
    <>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>{title}</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>
            {typeof content === "string" ? (
              <Text color="fg.muted">{content}</Text>
            ) : (
              content
            )}
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.ActionTrigger asChild>
              <Button variant="outline" {...cancelButtonProps}>
                {t({
                  message: "Cancel",
                  description: "confirmation dialog cancel button text",
                })}
              </Button>
            </Dialog.ActionTrigger>

            <Dialog.ActionTrigger asChild>
              <Button onClick={onConfirm} {...confirmButtonProps}>
                {t({
                  message: "Confirm",
                  description: "confirmation dialog confirm button text",
                })}
              </Button>
            </Dialog.ActionTrigger>
          </Dialog.Footer>
          <Dialog.CloseTrigger asChild>
            <CloseButton size="sm" />
          </Dialog.CloseTrigger>
        </Dialog.Content>
      </Dialog.Positioner>
    </>
  );
}
