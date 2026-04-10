import { useQuery } from "@tanstack/react-query";
import { pcCommandsQueryKeys } from "@/utils/hooks/queries/pcs/commands";
import { pcsApi } from "@/services/pcs";
import { useRequireAuth } from "@/lib/auth/use-auth";

export function usePcCommandsQuery(pcId: string) {
  const { user } = useRequireAuth();

  return useQuery({
    queryKey: pcCommandsQueryKeys.pcCommands(pcId),
    queryFn: pcsApi.fetchPcCommands(user?.id ?? "", pcId),
    enabled: !!user,
  });
}
