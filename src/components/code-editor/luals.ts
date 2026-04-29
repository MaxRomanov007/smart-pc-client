import * as monaco from "monaco-editor";
import type { MessageConnection } from "vscode-jsonrpc";
import type {
  DiagnosticSeverity,
  LspDiagnostic,
  PublishDiagnosticsParams,
} from "./types";

const LUALS_ADDRESS = process.env.NEXT_PUBLIC_LUALS_ADDRESS;

// Cache of the latest diagnostics from LuaLS — needed for codeAction requests
// to pass original objects with the code field (Monaco markers do not store it)
export const latestDiagnostics = new Map<string, LspDiagnostic[]>();
export const SCRIPT_URI = "file:///workspace/script.lua";

// Closing codes that make it worth reconnecting
const RECONNECTABLE_CODES = new Set([
  1001, // Going Away
  1006, // Abnormal closure (APISIX timeout, network drop)
  1012, // Service Restart
  1013, // Try Again Later
]);

const RECONNECT_BASE_MS = 1_000;
const RECONNECT_MAX_MS = 30_000;
const RECONNECT_JITTER_MS = 500;

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
      latestDiagnostics.set(params.uri, params.diagnostics);
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
        codeAction: {
          codeActionLiteralSupport: {
            codeActionKind: {
              valueSet: ["", "quickfix", "refactor", "refactor.rewrite"],
            },
          },
          isPreferredSupport: true,
        },
      },
      workspace: { didChangeConfiguration: {} },
    },
    clientInfo: { name: "monaco-lua-client" },
    initializationOptions: {},
  });

  await connection.sendNotification("initialized", {});
  await connection.sendNotification("textDocument/didOpen", {
    textDocument: {
      uri: SCRIPT_URI,
      languageId: "lua",
      version: 1,
      text: editor.getValue(),
    },
  });
}

async function connect(
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

// The controller manages the connection lifecycle and reconnection.
// It returns the dispose() function to completely stop
// (when the component is unmounted).
export function setupLuaLS(
  editor: monaco.editor.IStandaloneCodeEditor,
  monacoInst: typeof monaco,
  onConnection: (conn: MessageConnection) => void,
  onDisconnect: () => void,
): () => void {
  let ws: WebSocket | null = null;
  let attempt = 0;
  let stopped = false;
  let retryTimer: ReturnType<typeof setTimeout> | null = null;

  function clearRetryTimer(): void {
    if (retryTimer !== null) {
      clearTimeout(retryTimer);
      retryTimer = null;
    }
  }

  function scheduleReconnect(closeCode: number): void {
    if (stopped) return;
    if (!RECONNECTABLE_CODES.has(closeCode)) {
      console.warn(
        `[LuaLS] connection closed with code ${closeCode}, not reconnecting`,
      );
      return;
    }

    const delay = Math.min(
      RECONNECT_BASE_MS * 2 ** attempt + Math.random() * RECONNECT_JITTER_MS,
      RECONNECT_MAX_MS,
    );
    attempt++;
    console.log(
      `[LuaLS] reconnecting in ${Math.round(delay)}ms (attempt ${attempt})`,
    );
    retryTimer = setTimeout(run, delay);
  }

  function run(): void {
    if (stopped) return;

    connect(editor, monacoInst, onConnection)
      .then((socket) => {
        if (stopped) {
          socket.close();
          return;
        }

        ws = socket;
        attempt = 0; // reset the counter after a successful connection

        ws.addEventListener(
          "close",
          (ev) => {
            onDisconnect();
            ws = null;
            scheduleReconnect(ev.code);
          },
          { once: true },
        );
      })
      .catch((e) => {
        console.warn("[LuaLS] connection failed:", e);
        scheduleReconnect(1006); // We consider it as abnormal closure
      });
  }

  run();

  return function dispose(): void {
    stopped = true;
    clearRetryTimer();
    ws?.close();
    ws = null;
  };
}
