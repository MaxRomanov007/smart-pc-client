import type {
  GetConnection,
  HoverContents,
  LspHover,
  MarkedString,
  MarkupContent,
} from "@/types/luals";
import * as monaco from "monaco-editor";
import { SCRIPT_URI } from "@/components/code-editor/luals";

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

export function registerHover(
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
