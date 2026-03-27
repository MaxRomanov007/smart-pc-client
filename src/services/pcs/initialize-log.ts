import type { IPcLog } from "@/types/pc/pc-log";

export function initializeLog(raw: IPcLog): IPcLog {
  return {
    ...raw,
    receivedAt: new Date(raw.receivedAt),
    completedAt: new Date(raw.completedAt),
  } as IPcLog;
}
