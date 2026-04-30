import type {
  CompletionResult,
  GetConnection,
  LspCompletionItem,
  LspInsertTextEdit,
} from "@/types/luals";
import * as monaco from "monaco-editor";
import { SCRIPT_URI } from "@/components/code-editor/luals";

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

export function registerCompletion(
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
