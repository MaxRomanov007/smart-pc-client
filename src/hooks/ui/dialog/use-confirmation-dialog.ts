import {
  type Dispatch,
  type MouseEventHandler,
  type SetStateAction,
  useState,
} from "react";

type ConfirmationDialogState = {
  open: boolean;
  title?: string;
  text?: string;
  onConfirm?: MouseEventHandler<HTMLButtonElement>;
};

export type UseConfirmationDialogType = {
  show: (
    title: string,
    text: string,
    onConfirm?: MouseEventHandler<HTMLButtonElement>,
  ) => void;
  state: ConfirmationDialogState;
  setState: Dispatch<SetStateAction<ConfirmationDialogState>>;
};

export function useConfirmationDialog(): UseConfirmationDialogType {
  const [state, setState] = useState<ConfirmationDialogState>({
    open: false,
    title: "",
    text: "",
    onConfirm: undefined,
  });

  const show = (
    title: string,
    text: string,
    onConfirm?: MouseEventHandler<HTMLButtonElement>,
  ) => {
    setState({
      open: true,
      title: title,
      text: text,
      onConfirm: onConfirm,
    });
  };

  return {
    show,
    state,
    setState,
  };
}
