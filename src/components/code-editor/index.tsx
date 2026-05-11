"use client";

import dynamic from "next/dynamic";
import { Box } from "@chakra-ui/react";
import { type ComponentProps } from "react";

const CodeEditorClient = dynamic(() => import("./client"), { ssr: false });

interface CodeEditorProps extends Omit<ComponentProps<typeof Box>, "onChange"> {
  value?: string;
  onChange?: (value: string | undefined) => void;
  maxChars?: number;
  editorProps?: ComponentProps<typeof import("@monaco-editor/react").default>;
}

export default function CodeEditor(props: CodeEditorProps) {
  return <CodeEditorClient {...props} />;
}
