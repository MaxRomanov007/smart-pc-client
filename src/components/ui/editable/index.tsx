import { type ComponentProps, useState } from "react";
import { Editable as ChakraEditable } from "@chakra-ui/react";
import EditableControl from "./editable-control";

interface Props extends Omit<
  ComponentProps<typeof ChakraEditable.Root>,
  "value" | "onValueChange"
> {
  value?: string;
  onValueChange?: (value: string) => void;
}

export default function Editable({
  value: defaultValue,
  onValueChange,
}: Props) {
  const [value, setValue] = useState<string | undefined>(defaultValue);

  return (
    <ChakraEditable.Root
      value={value}
      onValueChange={(e) => setValue(e.value)}
      onValueCommit={(e) => onValueChange?.(e.value)}
    >
      <ChakraEditable.Preview />
      <ChakraEditable.Input />
      <EditableControl />
    </ChakraEditable.Root>
  );
}
