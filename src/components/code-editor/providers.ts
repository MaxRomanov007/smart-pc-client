import * as monaco from "monaco-editor";
import type { MessageConnection } from "vscode-jsonrpc";
import type {
  CodeActionResult,
  CompletionResult,
  HoverContents,
  LspCodeAction,
  LspCommand,
  LspCompletionItem,
  LspDiagnostic,
  LspHover,
  LspInsertTextEdit,
  LspWorkspaceTextEdit,
  MarkedString,
  MarkupContent,
} from "./types";
import { latestDiagnostics, SCRIPT_URI } from "./luals";

type GetConnection = () => MessageConnection | null;

// Hover contents to Monaco format

function isMarkupContent(value: HoverContents): value is MarkupContent {
  return typeof value === "object" && !Array.isArray(value) && "kind" in value;
}

function isMarkedString(value: unknown): value is MarkedString {
  return (
    typeof value === "string" ||
    (typeof value === "object" && value !== null && "language" in value)
  );
}

function mapContents(raw: HoverContents): { value: string }[] {
  if (Array.isArray(raw)) {
    return raw.map((c) => ({ value: typeof c === "string" ? c : c.value }));
  }
  if (isMarkupContent(raw)) return [{ value: raw.value }];
  if (isMarkedString(raw))
    return [{ value: typeof raw === "string" ? raw : raw.value }];
  return [];
}

// Completion

function lspItemToMonaco(
  item: LspCompletionItem,
  range: monaco.IRange,
  monacoInst: typeof monaco,
): monaco.languages.CompletionItem {
  return {
    label: item.label,
    kind: item.kind ?? monacoInst.languages.CompletionItemKind.Text,
    detail: item.detail,
    documentation: item.documentation
      ? typeof item.documentation === "string"
        ? { value: item.documentation }
        : { value: item.documentation.value }
      : undefined,
    insertText:
      (item.textEdit as LspInsertTextEdit | undefined)?.newText ??
      item.insertText ??
      item.label,
    insertTextRules:
      item.insertTextFormat === 2
        ? monacoInst.languages.CompletionItemInsertTextRule.InsertAsSnippet
        : undefined,
    range,
  };
}

function deduplicateItems(items: LspCompletionItem[]): LspCompletionItem[] {
  // LuaLS sometimes returns the same name twice—as Field (5) and
  // as Function (3). We keep Function if both are present.
  const LSP_FUNCTION_KIND = 3;
  const map = new Map<string, LspCompletionItem>();
  for (const item of items) {
    const prev = map.get(item.label);
    if (!prev || item.kind === LSP_FUNCTION_KIND) map.set(item.label, item);
  }
  return Array.from(map.values());
}

function registerCompletion(
  monacoInst: typeof monaco,
  getConnection: GetConnection,
): monaco.IDisposable {
  return monacoInst.languages.registerCompletionItemProvider("lua", {
    triggerCharacters: [".", ":", "("],

    async provideCompletionItems(model, position) {
      const connection = getConnection();
      if (!connection) return { suggestions: [] };

      try {
        const result = await connection.sendRequest<CompletionResult>(
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
        const range: monaco.IRange = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        };

        return {
          suggestions: deduplicateItems(items).map((item) =>
            lspItemToMonaco(item, range, monacoInst),
          ),
        };
      } catch (e) {
        console.warn("[LuaLS] completion error:", e);
        return { suggestions: [] };
      }
    },
  });
}

// Hover

function registerHover(
  monacoInst: typeof monaco,
  getConnection: GetConnection,
): monaco.IDisposable {
  return monacoInst.languages.registerHoverProvider("lua", {
    async provideHover(_model, position) {
      const connection = getConnection();
      if (!connection) return null;

      try {
        const result = await connection.sendRequest<LspHover | null>(
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
        return { contents: mapContents(result.contents) };
      } catch (e) {
        console.warn("[LuaLS] hover error:", e);
        return null;
      }
    },
  });
}

// Code Actions

function isCodeAction(item: LspCodeAction | LspCommand): item is LspCodeAction {
  return (
    "edit" in item ||
    ("kind" in item && !("command" in item && !("edit" in item)))
  );
}

function lspDiagnosticToMonaco(
  d: LspDiagnostic,
  monacoInst: typeof monaco,
): monaco.editor.IMarkerData {
  return {
    severity: monacoInst.MarkerSeverity.Error,
    startLineNumber: d.range.start.line + 1,
    startColumn: d.range.start.character + 1,
    endLineNumber: d.range.end.line + 1,
    endColumn: d.range.end.character + 1,
    message: d.message,
  };
}

function registerCodeActions(
  monacoInst: typeof monaco,
  getConnection: GetConnection,
): monaco.IDisposable {
  return monacoInst.languages.registerCodeActionProvider("lua", {
    async provideCodeActions(model, range, context) {
      const connection = getConnection();
      if (!connection) return { actions: [], dispose: () => {} };

      // We take the original diagnostics from LuaLS (with the code field) - Monaco
      // does not store code markers, and LuaLS does not match the diagnostics without it
      const cached = latestDiagnostics.get(SCRIPT_URI) ?? [];
      const diagnostics: LspDiagnostic[] = context.markers.map((m) => {
        const original = cached.find(
          (d) =>
            d.range.start.line === m.startLineNumber - 1 &&
            d.range.start.character === m.startColumn - 1 &&
            d.message === m.message,
        );
        return (
          original ?? {
            range: {
              start: {
                line: m.startLineNumber - 1,
                character: m.startColumn - 1,
              },
              end: { line: m.endLineNumber - 1, character: m.endColumn - 1 },
            },
            severity: (m.severity === monacoInst.MarkerSeverity.Error
              ? 1
              : m.severity === monacoInst.MarkerSeverity.Warning
                ? 2
                : 3) as LspDiagnostic["severity"],
            message: m.message,
            source: m.source,
          }
        );
      });

      try {
        const result = await connection.sendRequest<CodeActionResult>(
          "textDocument/codeAction",
          {
            textDocument: { uri: SCRIPT_URI },
            range: {
              start: {
                line: range.startLineNumber - 1,
                character: range.startColumn - 1,
              },
              end: {
                line: range.endLineNumber - 1,
                character: range.endColumn - 1,
              },
            },
            context: { diagnostics },
          },
        );

        if (!result?.length) return { actions: [], dispose: () => {} };

        const actions: monaco.languages.CodeAction[] = result
          .filter(isCodeAction)
          .map((item) => ({
            title: item.title,
            kind: item.kind ?? "quickfix",
            isPreferred: item.isPreferred ?? false,
            diagnostics: item.diagnostics?.map((d) =>
              lspDiagnosticToMonaco(d, monacoInst),
            ),
            edit: item.edit?.changes
              ? {
                  edits: Object.entries(item.edit.changes).flatMap(
                    ([, edits]) =>
                      (edits as LspWorkspaceTextEdit[]).map((e) => ({
                        resource: model.uri,
                        textEdit: {
                          range: new monacoInst.Range(
                            e.range.start.line + 1,
                            e.range.start.character + 1,
                            e.range.end.line + 1,
                            e.range.end.character + 1,
                          ),
                          text: e.newText,
                        },
                        versionId: model.getVersionId(),
                      })),
                  ),
                }
              : undefined,
          }));

        return { actions, dispose: () => {} };
      } catch (e) {
        console.warn("[LuaLS] codeAction error:", e);
        return { actions: [], dispose: () => {} };
      }
    },
  });
}

// Public

export function registerLuaLSProviders(
  monacoInst: typeof monaco,
  getConnection: GetConnection,
): monaco.IDisposable[] {
  return [
    registerCompletion(monacoInst, getConnection),
    registerHover(monacoInst, getConnection),
    registerCodeActions(monacoInst, getConnection),
  ];
}
