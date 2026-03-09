export interface IPcStateData {
  cpuPercent: number;
  virtualMemory: VirtualMemoryState;
  volume?: VolumeState;
}

export interface VirtualMemoryState {
  total: number;
  available: number;
}

export interface VolumeState {
  current?: number;
  muted?: boolean;
}
