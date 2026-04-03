import NotificationPage from "@/components/ui/pages/notification-page";
import { LuRss } from "react-icons/lu";
import { useExtracted } from "next-intl";
import LinkButton from "@/components/ui/button/link-button";
import { Button, HStack } from "@chakra-ui/react";

interface Props {
  onRetry: () => void;
}

export default function OfflineState({ onRetry }: Props) {
  const t = useExtracted("this-pc-offline-state");

  return (
    <NotificationPage
      icon={<LuRss />}
      title={t({
        message: "Cannot connect to agent",
        description: "title",
      })}
      description={t({
        message:
          "Cannot connect to agent, please check if agent is active and try again, or download it by button below if it not installed",
        description: "description",
      })}
    >
      <HStack>
        <LinkButton
          href="https://github.com/MaxRomanov007/smart-pc-agent/releases/latest"
          variant="outline"
        >
          {t({
            message: "Download from GitHub",
            description: "download link button text",
          })}
        </LinkButton>

        <Button onClick={onRetry}>
          {t({
            message: "Try again",
            description: "try again button text",
          })}
        </Button>
      </HStack>
    </NotificationPage>
  );
}
