import type { ReactNode } from "react";
import { Provider } from "@/components/ui/chakra/provider";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

export default async function Providers({ children }: { children: ReactNode }) {
  const messages = await getMessages();
  return (
    <NextIntlClientProvider messages={messages}>
      <Provider>{children}</Provider>
    </NextIntlClientProvider>
  );
}
