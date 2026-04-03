import NotificationState from "@/components/ui/pages/notification-page";
import { LuCuboid } from "react-icons/lu";
import { useExtracted } from "next-intl";

export function AgentCommandsListEmptyState() {
  const t = useExtracted("agent-commands-empty-state");

  return (
    <NotificationState
      icon={<LuCuboid />}
      title={t({
        message: "There are no commands",
        description: "title text",
      })}
      description={t({
        message: "Register commands on your PC first",
        description: "description text",
      })}
    />
  );
}
