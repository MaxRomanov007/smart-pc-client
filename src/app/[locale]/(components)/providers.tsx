import type { ReactNode } from "react";
import { Provider } from "@/components/ui/chakra/provider";

export default function Providers({ children }: { children: ReactNode }) {
  return <Provider>{children}</Provider>;
}
