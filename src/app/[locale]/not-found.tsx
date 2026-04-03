import type { Metadata } from "next";
import { LuAntenna } from "react-icons/lu";
import LinkButton from "@/components/ui/button/link-button";
import { PAGES } from "@/config/navigation/pages";
import { getExtracted } from "next-intl/server";
import NotificationPage from "@/components/ui/pages/notification-page";

export const metadata: Metadata = {
  title: "Locale",
};

export default async function LocalePage() {
  const t = await getExtracted("not-found-page");

  return (
    <NotificationPage
      icon={<LuAntenna />}
      title={t({
        message: "This page couldn't be found",
        description: "not found page title",
      })}
      description={t({
        message:
          "Looks like there's a mistake in the URL. Check it or go to the main page",
        description:
          "not found page help text with offer for go to the main page",
      })}
    >
      <LinkButton href={PAGES.index}>
        {t({
          message: "Go to main page",
          description: "not found page link button for main page text",
        })}
      </LinkButton>
    </NotificationPage>
  );
}
