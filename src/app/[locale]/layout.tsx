import { type ReactNode } from "react";
import { routing } from "@/i18n/routing";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import Providers from "@/app/[locale]/(components)/providers";
import Layout from "@/app/[locale]/(components)/layout/layout";
import Head from "next/head";
import type { Metadata } from "next";
import iconLight from "@/../public/logo/romanov-digital/mini.svg";
import iconDark from "@/../public/logo/romanov-digital/mini-dark.svg";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export const metadata: Metadata = {
  title: "Smart PC",
  icons: [
    {
      type: "image/svg+xml",
      url: iconDark.src,
      media: "(prefers-color-scheme: light)",
    },
    {
      type: "image/svg+xml",
      url: iconLight.src,
      media: "(prefers-color-scheme: dark)",
    },
  ],
};

export default async function RootLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <html lang={locale} suppressHydrationWarning>
      <Head>
        <link
          rel="icon"
          href="/logo/romanov-digital/mini.svg"
          type="image/svg+xml"
        />
      </Head>
      <body>
        <Providers locale={locale}>
          <Layout>{children}</Layout>
        </Providers>
      </body>
    </html>
  );
}
