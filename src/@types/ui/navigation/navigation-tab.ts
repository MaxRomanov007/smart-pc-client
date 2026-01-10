import type { ReactNode } from "react";

export type INavigationTab = {
  icon: ReactNode;
  href: string;
  label: string;
  tooltip?: string;
};
