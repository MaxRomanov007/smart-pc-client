import {
  createListCollection,
  Portal,
  Select,
  Span,
  Stack,
} from "@chakra-ui/react";
import { useExtracted } from "next-intl";
import { ParameterTypes } from "@/types/pc/command-parameter";
import { enumEntries, enumValueToKey } from "@/utils/enums";
import type { ComponentProps } from "react";

type TypeItem = {
  label: string;
  description: string;
  value: string;
  type: ParameterTypes;
};

interface Props extends Omit<ComponentProps<typeof Select.Root>, "collection"> {
  type: ParameterTypes;
  onTypeChange?: (type: ParameterTypes) => void;
  label?: string;
  placeholder?: string;
}

export default function TypeSelect({
  type,
  onTypeChange,
  label,
  placeholder,
  ...props
}: Props) {
  const t = useExtracted("agent-command-parameter-type-select");

  const types = createListCollection<TypeItem>({
    items: enumEntries(ParameterTypes).map<TypeItem>(([key, value]) => ({
      label: t({
        message:
          "{type, select, string {String} number {Number} boolean {Boolean} other {Unknown}}",
        values: {
          type: key,
        },
        description: "item label",
      }),
      description: t({
        message:
          "{type, select, string {You can use such a parameter as a string variable, it will be displayed as a text field} number {You can use such a parameter as a number variable, it will be displayed as a number input field} boolean {You can use such a parameter as a boolean variable, it will be displayed as a checkbox field} other {Unknown}}",
        values: {
          type: key,
        },
        description: "item description",
      }),
      type: value,
      value: key,
    })),
  });

  const value = enumValueToKey(ParameterTypes, type);

  return (
    <Select.Root
      collection={types}
      defaultValue={[ParameterTypes.string.toString()]}
      value={value && [value]}
      onValueChange={(e) => onTypeChange?.(e.items[0].type)}
      {...props}
    >
      <Select.HiddenSelect />

      {label && <Select.Label>{label}</Select.Label>}

      <Select.Control>
        <Select.Trigger>
          <Select.ValueText placeholder={placeholder} />
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>

      <Portal>
        <Select.Positioner>
          <Select.Content>
            {types.items.map((item) => (
              <Select.Item item={item} key={item.value}>
                <Stack gap={0}>
                  <Select.ItemText>{item.label}</Select.ItemText>
                  <Span color="fg.muted" textStyle="xs">
                    {item.description}
                  </Span>
                </Stack>
                <Select.ItemIndicator />
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Portal>
    </Select.Root>
  );
}
