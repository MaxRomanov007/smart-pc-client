import type { ReactNode } from "react";
import { Provider } from "@/components/ui/chakra/provider";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { LocaleProvider } from "@chakra-ui/react";
import { AuthProvider } from "@/lib/auth/auth-context";
import MQTTConnectionProvider from "@/components/providers/mqtt";
import QueryProvider from "@/components/providers/query";

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
          <QueryProvider>
            <AuthProvider>
              <MQTTConnectionProvider>{children}</MQTTConnectionProvider>
            </AuthProvider>
          </QueryProvider>
        </Provider>
      </LocaleProvider>
    </NextIntlClientProvider>
  );
}
