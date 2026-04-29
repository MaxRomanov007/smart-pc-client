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
  code?: string | number;
  source?: string;
  message: string;
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

export interface LspInsertTextEdit {
  newText: string;
}

export interface LspCompletionItem {
  label: string;
  kind?: LspCompletionItemKind;
  detail?: string;
  documentation?: string | MarkupContent;
  insertText?: string;
  insertTextFormat?: InsertTextFormat;
  textEdit?: LspInsertTextEdit;
}

export interface LspCompletionList {
  items: LspCompletionItem[];
  isIncomplete: boolean;
}

export type CompletionResult = LspCompletionItem[] | LspCompletionList | null;

// MarkedString is deprecated in LSP 3.x, but LuaLS can still send it.
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

// Code Actions

export interface LspWorkspaceTextEdit {
  range: LspRange;
  newText: string;
}

export interface LspWorkspaceEdit {
  changes?: Record<string, LspWorkspaceTextEdit[]>;
  // We don't use documentChanges — we work only with changes.
}

export interface LspCommand {
  title: string;
  command: string;
  arguments?: unknown[];
}

export type LspCodeActionKind = string; // "quickfix" | "refactor" | ...

export interface LspCodeAction {
  title: string;
  kind?: LspCodeActionKind;
  diagnostics?: LspDiagnostic[];
  isPreferred?: boolean;
  edit?: LspWorkspaceEdit;
  command?: LspCommand;
}

export type CodeActionResult = (LspCodeAction | LspCommand)[] | null;
