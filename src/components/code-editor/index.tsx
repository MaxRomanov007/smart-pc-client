"use client";

import Editor from "@monaco-editor/react";
import { Box } from "@chakra-ui/react";
import type { ComponentProps } from "react";
import { useColorModeValue } from "@/components/ui/chakra/color-mode";

interface CodeEditorProps extends Omit<ComponentProps<typeof Box>, "onChange"> {
  value?: string;
  onChange?: (value: string | undefined) => void;
  editorProps?: ComponentProps<typeof Editor>;
}

export default function CodeEditor({
  value,
  onChange,
  editorProps,
  ...props
}: CodeEditorProps) {
  const editorTheme = useColorModeValue("light", "vs-dark");

  return (
    <Box
      borderWidth="1px"
      borderRadius="md"
      overflow="hidden"
      borderColor="chakra-border-color"
      {...props}
    >
      <Editor
        language="lua"
        value={value}
        onChange={onChange}
        theme={editorTheme}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: "on",
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
        {...editorProps}
      />
    </Box>
  );
}
