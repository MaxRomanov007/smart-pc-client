import type { Metadata } from "next";
import { getExtracted } from "next-intl/server";
import NotificationPage from "@/components/ui/pages/notification-page";
import { LuCircleDashed } from "react-icons/lu";
import LinkButton from "@/components/ui/button/link-button";
import { PAGES } from "@/config/navigation/pages";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getExtracted("index-page-metadata");

  return {
    title: t({
      message: "Index page",
      description: "title of index page in metadata",
    }),
  };
}

export default async function MainPage() {
  const t = await getExtracted("index-page");

  return (
    <NotificationPage
      icon={<LuCircleDashed />}
      title={t({
        message: "Index page",
        description: "title of index page",
      })}
      description={t({
        message:
          "Here you can navigate to any other page. Use the button below to go to your PC list",
        description: "description of index page",
      })}
    >
      <LinkButton href={PAGES.dashboard}>
        {t({
          message: "Go to dashboard",
          description: "link button to dashboard text",
        })}
      </LinkButton>
    </NotificationPage>
  );
}
