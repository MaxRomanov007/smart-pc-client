import type {
  CodeActionResult,
  GetConnection,
  LspCodeAction,
  LspCommand,
  LspDiagnostic,
  LspWorkspaceTextEdit,
} from "@/types/luals";
import * as monaco from "monaco-editor";
import { latestDiagnostics, SCRIPT_URI } from "@/components/code-editor/luals";

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

export function registerCodeActions(
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
