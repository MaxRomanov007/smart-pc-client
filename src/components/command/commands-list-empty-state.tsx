import NotificationState from "@/components/ui/pages/notification-page";
import { LuCuboid } from "react-icons/lu";
import { useExtracted } from "next-intl";

export default function CommandsListEmptyState() {
  const t = useExtracted("pc-commands-empty-state");

  return (
    <NotificationState
      icon={<LuCuboid />}
      title={t({
        message: "There are no commands",
        description: "title text",
      })}
      description={t({
        message: "Register it on your pc",
        description: "description text",
      })}
    />
  );
}
