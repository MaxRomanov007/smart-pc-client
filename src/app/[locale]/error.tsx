"use client";

import { Button } from "@chakra-ui/react";
import { LuTriangleAlert } from "react-icons/lu";
import { useExtracted } from "next-intl";
import NotificationPage from "@/components/ui/pages/notification-page";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useExtracted("error-page");

  return (
    <NotificationPage
      icon={<LuTriangleAlert />}
      title={t({
        message: "Something went wrong",
        description: "error page title",
      })}
      description={error.message}
    >
      <Button onClick={() => reset()}>
        {t({
          message: "Reset",
          description: "reset button text",
        })}
      </Button>
    </NotificationPage>
  );
}
