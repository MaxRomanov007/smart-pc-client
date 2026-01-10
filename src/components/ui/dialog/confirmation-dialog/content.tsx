"use client";

import { Button, CloseButton, Dialog, Text } from "@chakra-ui/react";
import { type MouseEventHandler } from "react";
import { useExtracted } from "next-intl";

interface Props {
  title?: string;
  text?: string;
  onConfirm?: MouseEventHandler<HTMLButtonElement>;
}

export default function Content({ title, text, onConfirm }: Props) {
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
            <Text>{text}</Text>
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.ActionTrigger asChild>
              <Button variant="outline">
                {t({
                  message: "Cancel",
                  description: "confirmation dialog cancel button text",
                })}
              </Button>
            </Dialog.ActionTrigger>

            <Dialog.ActionTrigger asChild>
              <Button onClick={onConfirm}>
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
