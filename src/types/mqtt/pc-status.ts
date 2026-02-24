export const PcStatuses = {
  online: "online",
  offline: "offline",
} as const;

type PcStatusType = (typeof PcStatuses)[keyof typeof PcStatuses];

export interface IPcStatusData {
  status: PcStatusType;
}