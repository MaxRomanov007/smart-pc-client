import * as monaco from "monaco-editor";
import type { MessageConnection } from "vscode-jsonrpc";
import type {
  CompletionResult,
  HoverContents,
  LspCompletionItem,
  LspHover,
  MarkedString,
  MarkupContent,
} from "./types";
import { SCRIPT_URI } from "./luals";

type GetConnection = () => MessageConnection | null;

// ── Hover contents → Monaco format ───────────────────────────────────────────

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

// ── Completion ────────────────────────────────────────────────────────────────

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
    insertText: item.textEdit?.newText ?? item.insertText ?? item.label,
    insertTextRules:
      item.insertTextFormat === 2
        ? monacoInst.languages.CompletionItemInsertTextRule.InsertAsSnippet
        : undefined,
    range,
  };
}

function deduplicateItems(items: LspCompletionItem[]): LspCompletionItem[] {
  // LuaLS иногда возвращает одно имя дважды — как Field (5) и как Function (3).
  // Оставляем Function если есть оба.
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

// ── Hover ─────────────────────────────────────────────────────────────────────

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

// ── Public ────────────────────────────────────────────────────────────────────

export function registerLuaLSProviders(
  monacoInst: typeof monaco,
  getConnection: GetConnection,
): monaco.IDisposable[] {
  return [
    registerCompletion(monacoInst, getConnection),
    registerHover(monacoInst, getConnection),
  ];
}
