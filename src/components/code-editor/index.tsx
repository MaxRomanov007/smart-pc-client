"use client";

import Editor from "@monaco-editor/react";
import { Box } from "@chakra-ui/react";
import { type ComponentProps, useEffect, useRef } from "react";
import * as monaco from "monaco-editor";
import type { MessageConnection } from "vscode-jsonrpc";
import { useColorModeValue } from "@/components/ui/chakra/color-mode";
import { SCRIPT_URI, setupLuaLS } from "./luals";
import { registerLuaLSProviders } from "./providers";
import { debounce } from "@/utils/time/debounce";

const LUALS_DEBOUNCE_MS = 300;

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
  const lualsDisposablesRef = useRef<monaco.IDisposable[]>([]);
  const lualsDisposeRef = useRef<(() => void) | null>(null);
  const connectionRef = useRef<MessageConnection | null>(null);
  const docVersionRef = useRef<number>(2);
  const unmountedRef = useRef<boolean>(false);

  const editorTheme = useColorModeValue("light", "vs-dark");

  const handleEditorDidMount = (
    editor: monaco.editor.IStandaloneCodeEditor,
    monacoInst: typeof monaco,
  ) => {
    const sendDidChange = debounce((text: string, version: number) => {
      connectionRef.current?.sendNotification("textDocument/didChange", {
        textDocument: { uri: SCRIPT_URI, version },
        contentChanges: [{ text }],
      });
    }, LUALS_DEBOUNCE_MS);

    editor.onDidChangeModelContent(() => {
      if (!connectionRef.current) return;
      sendDidChange(editor.getValue(), docVersionRef.current++);
    });

    // We register providers once - they read connectionRef dynamically,
    // so they will work correctly after each reconnection
    lualsDisposablesRef.current.forEach((d) => d.dispose());
    lualsDisposablesRef.current = registerLuaLSProviders(
      monacoInst,
      () => connectionRef.current,
    );

    lualsDisposeRef.current = setupLuaLS(
      editor,
      monacoInst,
      (conn) => {
        if (unmountedRef.current) {
          conn.dispose();
          return;
        }
        // When reconnecting, the old connection is closed automatically,
        // just replace the ref - providers will pick up the new one on the next call
        connectionRef.current?.dispose();
        connectionRef.current = conn;
        // Resetting the document version - LuaLS gets didOpen again after reconnect
        docVersionRef.current = 2;
      },
      () => {
        // onDisconnect: resets the connection so that providers don't send requests
        // to a dead connection while reconnecting.
        connectionRef.current = null;
      },
    );

    editorProps?.onMount?.(editor, monacoInst);
  };

  // clean on unmount
  useEffect(() => {
    unmountedRef.current = false;
    return () => {
      unmountedRef.current = true;
      lualsDisposablesRef.current.forEach((d) => d.dispose());
      lualsDisposablesRef.current = [];
      connectionRef.current?.dispose();
      connectionRef.current = null;
      lualsDisposeRef.current?.();
      lualsDisposeRef.current = null;
    };
  }, []);

  return (
    <Box
      height="400px"
      minHeight="200px"
      borderWidth="1px"
      borderRadius="md"
      borderColor="chakra-border-color"
      position="relative"
      {...props}
    >
      <Editor
        language="lua"
        defaultValue={value ?? `-- Lua 5.1\n`}
        onChange={onChange}
        theme={editorTheme}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: "on",
          scrollBeyondLastLine: false,
          automaticLayout: true,
          suggestOnTriggerCharacters: true,
          quickSuggestions: true,
          parameterHints: { enabled: true },
          renderValidationDecorations: "on",
        }}
        {...editorProps}
      />
    </Box>
  );
}
