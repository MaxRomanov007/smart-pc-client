import {
  type Dispatch,
  type MouseEventHandler,
  type ReactNode,
  type SetStateAction,
  useState,
} from "react";

type ConfirmationDialogState = {
  open: boolean;
  title?: string;
  content?: string | ReactNode;
  onConfirm?: MouseEventHandler<HTMLButtonElement>;
};

export type UseConfirmationDialogType = {
  show: (
    title: string,
    content: string | ReactNode,
    onConfirm?: MouseEventHandler<HTMLButtonElement>,
  ) => void;
  state: ConfirmationDialogState;
  setState: Dispatch<SetStateAction<ConfirmationDialogState>>;
};

export function useConfirmationDialog(): UseConfirmationDialogType {
  const [state, setState] = useState<ConfirmationDialogState>({
    open: false,
    title: "",
    content: "",
    onConfirm: undefined,
  });

  const show = (
    title: string,
    content: string | ReactNode,
    onConfirm?: MouseEventHandler<HTMLButtonElement>,
  ) => {
    setState({
      open: true,
      title: title,
      content: content,
      onConfirm: onConfirm,
    });
  };

  return {
    show,
    state,
    setState,
  };
}
