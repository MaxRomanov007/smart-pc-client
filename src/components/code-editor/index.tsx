"use client";

import Editor, { useMonaco } from "@monaco-editor/react";
import { Box } from "@chakra-ui/react";
import { type ComponentProps, useEffect, useRef } from "react";
import * as monaco from "monaco-editor";
import type { MessageConnection } from "vscode-jsonrpc";
import { useColorModeValue } from "@/components/ui/chakra/color-mode";

// ── Типы схемы агента ─────────────────────────────────────────────────────────

export interface ParamDoc {
  name: string;
  type: string;
  description: string;
  optional?: boolean;
}

export interface ReturnDoc {
  type: string;
  description: string;
}

export interface FunctionDoc {
  description: string;
  params: ParamDoc[];
  returns: ReturnDoc[] | null;
  example?: string;
}

export interface ModuleDoc {
  description: string;
  functions: Record<string, FunctionDoc>;
}

export interface AgentAPISchema {
  version: string;
  modules: Record<string, ModuleDoc>;
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface CodeEditorProps extends Omit<ComponentProps<typeof Box>, "onChange"> {
  value?: string;
  onChange?: (value: string | undefined) => void;
  editorProps?: ComponentProps<typeof Editor>;
}

// ── LuaLS через WebSocket ─────────────────────────────────────────────────────

const LUALS_ADDRESS = process.env.NEXT_PUBLIC_LUALS_ADDRESS;
const SCRIPT_URI = "file:///workspace/script.lua";

async function setupLuaLS(
  editor: monaco.editor.IStandaloneCodeEditor,
  monacoInst: typeof monaco,
  onConnection: (conn: MessageConnection) => void,
): Promise<WebSocket> {
  // vscode-ws-jsonrpc@3.x: toSocket перезатирает ws.onopen/onerror,
  // поэтому ждём открытия ДО вызова toSocket
  const { toSocket } = await import("vscode-ws-jsonrpc");
  const { createMessageConnection } = await import("vscode-jsonrpc/browser");
  const { WebSocketMessageReader, WebSocketMessageWriter } =
    await import("vscode-ws-jsonrpc");

  const proto = window.location.protocol === "https:" ? "wss" : "ws";
  const url = LUALS_ADDRESS
    ? `${proto}://${LUALS_ADDRESS}`
    : `${proto}://${window.location.host}/luals/`;

  const ws = new WebSocket(url);

  // Ждём открытия до того как toSocket перехватит колбэки
  await new Promise<void>((resolve, reject) => {
    ws.addEventListener("open", () => resolve(), { once: true });
    ws.addEventListener(
      "error",
      (ev) =>
        reject(
          new Error(
            `LuaLS WS error: ${(ev as ErrorEvent).message ?? "failed"}`,
          ),
        ),
      { once: true },
    );
  });

  const socket = toSocket(ws);
  const reader = new WebSocketMessageReader(socket);
  const writer = new WebSocketMessageWriter(socket);
  const connection = createMessageConnection(reader, writer);

  // Обрабатываем диагностику
  connection.onNotification(
    "textDocument/publishDiagnostics",
    (params: any) => {
      const model = editor.getModel();
      console.log(
        "[LuaLS] diagnostics:",
        params.diagnostics?.length ?? 0,
        "| model:",
        model ? model.uri.toString() : "NULL",
      );

      if (!model) return;

      // ✅ УБРАЛИ ПРОВЕРКУ URI — она всегда false для авто-моделей
      // if (model.uri.toString() !== SCRIPT_URI) return;

      const markers: monaco.editor.IMarkerData[] = (
        params.diagnostics ?? []
      ).map((d: any) => ({
        severity:
          d.severity === 1
            ? monacoInst.MarkerSeverity.Error
            : d.severity === 2
              ? monacoInst.MarkerSeverity.Warning
              : monacoInst.MarkerSeverity.Info,
        startLineNumber: d.range.start.line + 1,
        startColumn: d.range.start.character + 1,
        endLineNumber: d.range.end.line + 1,
        endColumn: d.range.end.character + 1,
        message: d.message,
        source: d.source ?? "lua-ls",
      }));

      console.log("✅ Setting markers:", markers.length);
      monacoInst.editor.setModelMarkers(model, "lua-ls", markers);
    },
  );

  // Тихо игнорируем служебные нотификации LuaLS
  connection.onNotification("window/logMessage", () => {});
  connection.onNotification("window/showMessage", () => {});
  connection.onNotification("$/progress", () => {});

  // Обрабатываем входящие requests от LuaLS
  // window/workDoneProgress/create — LuaLS ждёт ответа, без него блокирует диагностику
  connection.onRequest("window/workDoneProgress/create", () => {
    console.debug("[LuaLS] window/workDoneProgress/create → OK");
    return {};
  });
  // Любые другие неизвестные requests — отвечаем null чтобы не блокировать LuaLS
  connection.onRequest((method, _params) => {
    console.debug("[LuaLS] unknown request:", method, "→ returning null");
    return null;
  });

  // Логируем все входящие сообщения для отладки
  connection.onUnhandledNotification((n) => {
    console.log(
      "[LuaLS] notification:",
      n.method,
      JSON.stringify(n.params)?.slice(0, 200),
    );
  });
  connection.onError((e) => {
    console.error("[LuaLS] connection error:", e);
  });
  connection.onClose(() => {
    console.warn("[LuaLS] connection closed");
  });

  connection.listen();
  console.log("[LuaLS] connection listening, sending initialize...");

  // LSP handshake
  await connection.sendRequest("initialize", {
    processId: null,
    rootUri: "file:///workspace",
    capabilities: {
      textDocument: {
        publishDiagnostics: { relatedInformation: true },
        synchronization: { didSave: false, willSave: false },
      },
      workspace: { didChangeConfiguration: {} },
    },
    clientInfo: { name: "monaco-lua-client" },
    initializationOptions: {},
  });

  console.log("[LuaLS] initialize OK, sending initialized + didOpen");
  connection.sendNotification("initialized", {});

  // Открываем документ
  connection.sendNotification("textDocument/didOpen", {
    textDocument: {
      uri: SCRIPT_URI,
      languageId: "lua",
      version: 1,
      text: editor.getValue(),
    },
  });

  console.log("[LuaLS] setup complete, passing connection to component");
  onConnection(connection);

  return ws;
}

// ── LSP-провайдеры для Monaco (completion + hover через LuaLS) ───────────────

function registerLuaLSProviders(
  monacoInstance: typeof monaco,
  getConnection: () => MessageConnection | null,
): monaco.IDisposable[] {
  const disposables: monaco.IDisposable[] = [];

  // Completion через LuaLS
  disposables.push(
    monacoInstance.languages.registerCompletionItemProvider("lua", {
      triggerCharacters: [".", ":", "("],

      async provideCompletionItems(model, position) {
        const connection = getConnection();
        if (!connection) return { suggestions: [] };

        try {
          const result: any = await connection.sendRequest(
            "textDocument/completion",
            {
              textDocument: { uri: SCRIPT_URI },
              position: {
                line: position.lineNumber - 1,
                character: position.column - 1,
              },
            },
          );

          if (!result) return { suggestions: [] };

          const items = Array.isArray(result) ? result : (result.items ?? []);
          const word = model.getWordUntilPosition(position);
          const range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn,
          };

          const deduped = new Map<string, any>();
          for (const item of items) {
            const existing = deduped.get(item.label);
            if (!existing) {
              deduped.set(item.label, item);
            } else {
              if (item.kind === 3) {
                deduped.set(item.label, item);
              }
            }
          }

          return {
            suggestions: Array.from(deduped.values()).map((item: any) => ({
              label: item.label,
              kind:
                item.kind ?? monacoInstance.languages.CompletionItemKind.Text,
              detail: item.detail,
              documentation: item.documentation
                ? typeof item.documentation === "string"
                  ? { value: item.documentation }
                  : item.documentation
                : undefined,
              insertText:
                item.textEdit?.newText ?? item.insertText ?? item.label,
              insertTextRules:
                item.insertTextFormat === 2
                  ? monacoInstance.languages.CompletionItemInsertTextRule
                      .InsertAsSnippet
                  : undefined,
              range,
            })),
          };
        } catch (e) {
          console.warn("[LuaLS] completion error:", e);
          return { suggestions: [] };
        }
      },
    }),
  );

  // Hover через LuaLS
  disposables.push(
    monacoInstance.languages.registerHoverProvider("lua", {
      async provideHover(_model, position) {
        const connection = getConnection();
        if (!connection) return null;

        try {
          const result: any = await connection.sendRequest(
            "textDocument/hover",
            {
              textDocument: { uri: SCRIPT_URI },
              position: {
                line: position.lineNumber - 1,
                character: position.column - 1,
              },
            },
          );

          if (!result?.contents) return null;

          // LSP MarkedString | MarkupContent | MarkedString[]
          const raw = result.contents;
          let contents: { value: string }[];

          if (Array.isArray(raw)) {
            // MarkedString[]
            contents = raw.map((c: any) =>
              typeof c === "string" ? { value: c } : { value: c.value ?? "" },
            );
          } else if (typeof raw === "string") {
            contents = [{ value: raw }];
          } else if (raw.kind === "markdown" || raw.kind === "plaintext") {
            // MarkupContent
            contents = [{ value: raw.value ?? "" }];
          } else {
            // MarkedString { language, value }
            contents = [{ value: raw.value ?? "" }];
          }

          return { contents };
        } catch (e) {
          console.warn("[LuaLS] hover error:", e);
          return null;
        }
      },
    }),
  );

  return disposables;
}

// ── Компонент ─────────────────────────────────────────────────────────────────

export default function CodeEditor({
  value,
  onChange,
  editorProps,
  ...props
}: CodeEditorProps) {
  const monacoInstance = useMonaco();
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const disposablesRef = useRef<monaco.IDisposable[]>([]);
  const lualsDisposablesRef = useRef<monaco.IDisposable[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const connectionRef = useRef<MessageConnection | null>(null);
  const docVersionRef = useRef<number>(2);
  // Защита от StrictMode: если компонент размонтировался пока шёл async setup
  const unmountedRef = useRef<boolean>(false);

  // registerAgentCompletion убран — LuaLS уже знает про spc.* через definitions/spc.lua
  // и предоставляет completion + hover сам через LSP

  const handleEditorDidMount = async (
    editor: monaco.editor.IStandaloneCodeEditor,
    monacoInst: typeof monaco,
  ) => {
    editorRef.current = editor;

    editor.onDidChangeModelContent(() => {
      const connection = connectionRef.current;
      if (!connection) return;

      const ver = docVersionRef.current++;
      console.debug("[LuaLS] didChange v" + ver);
      connection.sendNotification("textDocument/didChange", {
        textDocument: { uri: SCRIPT_URI, version: ver },
        contentChanges: [{ text: editor.getValue() }],
      });
    });

    try {
      const wsResult = await setupLuaLS(editor, monacoInst, (conn) => {
        if (unmountedRef.current) {
          // Компонент размонтировался пока шёл handshake — сразу закрываем
          conn.dispose();
          return;
        }
        connectionRef.current = conn;
      });

      if (!unmountedRef.current) {
        wsRef.current = wsResult;
        console.log("[LuaLS] ws saved to ref");
        // Регистрируем LSP-провайдеры (completion + hover через LuaLS)
        if (monacoInstance) {
          lualsDisposablesRef.current.forEach((d) => d.dispose());
          lualsDisposablesRef.current = registerLuaLSProviders(
            monacoInstance,
            () => connectionRef.current,
          );
        }
      } else {
        console.warn("[LuaLS] component unmounted during setup, closing ws");
        wsResult.close();
      }
    } catch (e) {
      console.warn(
        "[CodeEditor] LuaLS недоступен, используется только schema-completion",
        e,
      );
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

  const editorTheme = useColorModeValue("light", "vs-dark");

  return (
    <Box
      height="400px" // ← добавил
      minHeight="200px" // ← добавил
      borderWidth="1px"
      borderRadius="md"
      borderColor="chakra-border-color"
      position="relative" // ← добавил
      {...props}
    >
      <Editor
        language="lua"
        defaultValue={`-- Lua 5.1\nlocal x = math.floor(3.7)\nprint(x)\n`}
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
