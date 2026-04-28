export type DiagnosticSeverity = 1 | 2 | 3 | 4; // Error | Warning | Information | Hint

export interface LspPosition {
  line: number;
  character: number;
}

export interface LspRange {
  start: LspPosition;
  end: LspPosition;
}

export interface LspDiagnostic {
  range: LspRange;
  severity?: DiagnosticSeverity;
  message: string;
  source?: string;
}

export interface PublishDiagnosticsParams {
  uri: string;
  version?: number;
  diagnostics: LspDiagnostic[];
}

// CompletionItem.kind: https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/#completionItemKind
export type LspCompletionItemKind = number;

// insertTextFormat: 1 = PlainText, 2 = Snippet
export type InsertTextFormat = 1 | 2;

export interface LspTextEdit {
  newText: string;
}

export interface LspCompletionItem {
  label: string;
  kind?: LspCompletionItemKind;
  detail?: string;
  documentation?: string | MarkupContent;
  insertText?: string;
  insertTextFormat?: InsertTextFormat;
  textEdit?: LspTextEdit;
}

export interface LspCompletionList {
  items: LspCompletionItem[];
  isIncomplete: boolean;
}

export type CompletionResult = LspCompletionItem[] | LspCompletionList | null;

// MarkedString — deprecated в LSP 3.x но LuaLS всё ещё может его слать
export type MarkedString = string | { language: string; value: string };

export interface MarkupContent {
  kind: "plaintext" | "markdown";
  value: string;
}

export type HoverContents = MarkedString | MarkedString[] | MarkupContent;

export interface LspHover {
  contents: HoverContents;
  range?: LspRange;
}
