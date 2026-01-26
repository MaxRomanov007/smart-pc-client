export interface IPc {
  id: string;
  name: string;
  slug: string;
  description: string;
  canPowerOn: boolean;
}

export interface IPcItem extends IPc {
  online?: boolean;
}