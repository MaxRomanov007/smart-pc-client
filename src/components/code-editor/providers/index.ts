import * as monaco from "monaco-editor";
import { registerCompletion } from "./completion";
import { registerHover } from "./hover";
import { registerCodeActions } from "./code-actions";
import type { GetConnection } from "@/types/luals";

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
