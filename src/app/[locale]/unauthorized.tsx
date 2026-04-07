import type { Metadata } from "next";
import SignInButton from "@/components/button/auth/sign-in-button";
import { LuOctagonX } from "react-icons/lu";
import { getExtracted } from "next-intl/server";
import NotificationPage from "@/components/ui/pages/notification-page";

export const metadata: Metadata = {
  title: "Unauthorized",
};

export default async function UnauthorizedPage() {
  const t = await getExtracted("unauthorized page");

  return (
    <NotificationPage
      icon={<LuOctagonX />}
      title={t({
        message: "You're not authorized",
        description: "unauthorized page title",
      })}
      description={t({
        message:
          "You're not authorized. Sign in by clicking button below to access this page",
        description: "description",
      })}
    >
      <SignInButton variant="solid" rounded="md" />
    </NotificationPage>
  );
}
