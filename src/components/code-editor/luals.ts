import * as monaco from "monaco-editor";
import type { MessageConnection } from "vscode-jsonrpc";
import type { DiagnosticSeverity, PublishDiagnosticsParams } from "./types";

const LUALS_ADDRESS = process.env.NEXT_PUBLIC_LUALS_ADDRESS;
export const SCRIPT_URI = "file:///workspace/script.lua";

function getLuaLSUrl(): string {
  const proto = window.location.protocol === "https:" ? "wss" : "ws";
  return LUALS_ADDRESS
    ? `${proto}://${LUALS_ADDRESS}`
    : `${proto}://${window.location.host}/luals/`;
}

function lspSeverityToMonaco(
  severity: DiagnosticSeverity | undefined,
  monacoInst: typeof monaco,
): monaco.MarkerSeverity {
  switch (severity) {
    case 1:
      return monacoInst.MarkerSeverity.Error;
    case 2:
      return monacoInst.MarkerSeverity.Warning;
    case 3:
      return monacoInst.MarkerSeverity.Info;
    default:
      return monacoInst.MarkerSeverity.Hint;
  }
}

function setupDiagnostics(
  connection: MessageConnection,
  editor: monaco.editor.IStandaloneCodeEditor,
  monacoInst: typeof monaco,
): void {
  connection.onNotification(
    "textDocument/publishDiagnostics",
    (params: PublishDiagnosticsParams) => {
      const model = editor.getModel();
      if (!model) return;

      const markers: monaco.editor.IMarkerData[] = params.diagnostics.map(
        (d) => ({
          severity: lspSeverityToMonaco(d.severity, monacoInst),
          startLineNumber: d.range.start.line + 1,
          startColumn: d.range.start.character + 1,
          endLineNumber: d.range.end.line + 1,
          endColumn: d.range.end.character + 1,
          message: d.message,
          source: d.source ?? "lua-ls",
        }),
      );

      monacoInst.editor.setModelMarkers(model, "lua-ls", markers);
    },
  );
}

function suppressNoise(connection: MessageConnection): void {
  connection.onNotification("window/logMessage", () => {});
  connection.onNotification("window/showMessage", () => {});
  connection.onNotification("$/progress", () => {});
  connection.onRequest("window/workDoneProgress/create", () => ({}));
  connection.onRequest(() => null);
}

async function handshake(
  connection: MessageConnection,
  editor: monaco.editor.IStandaloneCodeEditor,
): Promise<void> {
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

  connection.sendNotification("initialized", {});
  connection.sendNotification("textDocument/didOpen", {
    textDocument: {
      uri: SCRIPT_URI,
      languageId: "lua",
      version: 1,
      text: editor.getValue(),
    },
  });
}

export async function setupLuaLS(
  editor: monaco.editor.IStandaloneCodeEditor,
  monacoInst: typeof monaco,
  onConnection: (conn: MessageConnection) => void,
): Promise<WebSocket> {
  const { toSocket, WebSocketMessageReader, WebSocketMessageWriter } =
    await import("vscode-ws-jsonrpc");
  const { createMessageConnection } = await import("vscode-jsonrpc/browser");

  const ws = new WebSocket(getLuaLSUrl());

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
  const connection = createMessageConnection(
    new WebSocketMessageReader(socket),
    new WebSocketMessageWriter(socket),
  );

  setupDiagnostics(connection, editor, monacoInst);
  suppressNoise(connection);

  connection.onError((e) => console.error("[LuaLS] error:", e));
  connection.onClose(() => console.warn("[LuaLS] closed"));
  connection.listen();

  await handshake(connection, editor);

  onConnection(connection);
  return ws;
}
