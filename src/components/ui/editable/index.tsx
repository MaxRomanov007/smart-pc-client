import { type ComponentProps, useState } from "react";
import { Editable as ChakraEditable, Textarea } from "@chakra-ui/react";
import EditableControl from "./editable-control";

interface Props extends Omit<
  ComponentProps<typeof ChakraEditable.Root>,
  "value" | "onValueChange"
> {
  value?: string;
  onValueChange?: (value: string) => void;
  textarea?: boolean | ComponentProps<typeof Textarea>;
  previewProps?: ComponentProps<typeof ChakraEditable.Preview>;
}

export default function Editable({
  value: defaultValue,
  onValueChange,
  textarea,
  previewProps,
}: Props) {
  const [value, setValue] = useState<string | undefined>(defaultValue);

  return (
    <ChakraEditable.Root
      value={value}
      onValueChange={(e) => setValue(e.value)}
      onValueCommit={(e) => onValueChange?.(e.value)}
    >
      <ChakraEditable.Preview {...previewProps} />

      {textarea ? (
        <ChakraEditable.Textarea asChild>
          {textarea === true ? <Textarea /> : <Textarea {...textarea} />}
        </ChakraEditable.Textarea>
      ) : (
        <ChakraEditable.Input />
      )}

      <EditableControl />
    </ChakraEditable.Root>
  );
}
