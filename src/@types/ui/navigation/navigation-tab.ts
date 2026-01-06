import type { ReactNode } from "react";

export interface INavigationTab {
  icon: ReactNode;
  href: string;
  tooltipMessageId: string;
  textMessageId: string;
}
