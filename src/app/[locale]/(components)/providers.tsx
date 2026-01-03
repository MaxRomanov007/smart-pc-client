import type { ReactNode } from "react";
import { Provider } from "@/components/ui/chakra/provider";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Toaster } from "@/components/ui/chakra/toaster";

export default async function Providers({ children }: { children: ReactNode }) {
  const messages = await getMessages();
  return (
    <NextIntlClientProvider messages={messages}>
      <Provider>
        {children}
        <Toaster />
      </Provider>
    </NextIntlClientProvider>
  );
}
