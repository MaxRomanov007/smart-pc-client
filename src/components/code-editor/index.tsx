"use client";

import Editor from "@monaco-editor/react";
import { Box } from "@chakra-ui/react";
import { type ComponentProps, useEffect, useRef } from "react";
import * as monaco from "monaco-editor";
import type { MessageConnection } from "vscode-jsonrpc";
import { useColorModeValue } from "@/components/ui/chakra/color-mode";
import { SCRIPT_URI, setupLuaLS } from "./luals";
import { registerLuaLSProviders } from "./providers";

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
  const wsRef = useRef<WebSocket | null>(null);
  const connectionRef = useRef<MessageConnection | null>(null);
  const docVersionRef = useRef<number>(2);
  const unmountedRef = useRef<boolean>(false);

  const editorTheme = useColorModeValue("light", "vs-dark");

  const handleEditorDidMount = async (
    editor: monaco.editor.IStandaloneCodeEditor,
    monacoInst: typeof monaco,
  ) => {
    // Синхронизируем изменения с LuaLS
    editor.onDidChangeModelContent(() => {
      const connection = connectionRef.current;
      if (!connection) return;
      connection.sendNotification("textDocument/didChange", {
        textDocument: { uri: SCRIPT_URI, version: docVersionRef.current++ },
        contentChanges: [{ text: editor.getValue() }],
      });
    });

    try {
      const ws = await setupLuaLS(editor, monacoInst, (conn) => {
        if (unmountedRef.current) {
          conn.dispose();
          return;
        }
        connectionRef.current = conn;
      });

      if (unmountedRef.current) {
        ws.close();
        return;
      }

      wsRef.current = ws;

      // Регистрируем провайдеры completion + hover через LuaLS
      // monacoInst из onMount гарантированно не null в отличие от useMonaco()
      lualsDisposablesRef.current.forEach((d) => d.dispose());
      lualsDisposablesRef.current = registerLuaLSProviders(
        monacoInst,
        () => connectionRef.current,
      );
    } catch (e) {
      console.warn("[CodeEditor] LuaLS unavailable:", e);
    }

    editorProps?.onMount?.(editor, monacoInst);
  };

  useEffect(() => {
    unmountedRef.current = false;
    return () => {
      unmountedRef.current = true;
      lualsDisposablesRef.current.forEach((d) => d.dispose());
      lualsDisposablesRef.current = [];
      connectionRef.current?.dispose();
      connectionRef.current = null;
      wsRef.current?.close();
      wsRef.current = null;
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
        defaultValue={"-- Lua 5.1\nlocal x = math.floor(3.7)\nprint(x)\n"}
        value={value}
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
