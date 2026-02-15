import type { ReactNode } from "react";
import { Provider } from "@/components/ui/chakra/provider";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Toaster } from "@/components/ui/chakra/toaster";
import { LocaleProvider } from "@chakra-ui/react";
import { SessionProvider } from "next-auth/react";

interface Props {
  locale: string;
  children: ReactNode;
}

export default async function Providers({ children, locale }: Props) {
  const messages = await getMessages();
  return (
    <NextIntlClientProvider messages={messages}>
      <LocaleProvider locale={locale}>
        <Provider>
          <SessionProvider>{children}</SessionProvider>
          <Toaster />
        </Provider>
      </LocaleProvider>
    </NextIntlClientProvider>
  );
}
