import { useRequireAuth } from "@/lib/auth/use-auth";
import { useQuery } from "@tanstack/react-query";
import { pcsApi } from "@/services/pcs";
import type { CommandParameter } from "@/types/pc/command-parameter";
import { pcCommandParametersQueryKeys } from "@/utils/hooks/queries/pcs/commands/parameters";

export interface UsePcCommandParametersQueryOptions {
  enabled?: boolean;
  placeholder?: CommandParameter[];
}

export function usePcCommandParametersQuery(
  pcId: string,
  commandId: string,
  opts?: UsePcCommandParametersQueryOptions,
) {
  const {user} = useRequireAuth();

  return useQuery({
    queryKey: pcCommandParametersQueryKeys.pcCommandParameters(pcId, commandId),
    queryFn: pcsApi.fetchPcCommandParameters(user?.id ?? "", pcId, commandId),
    enabled: opts?.enabled && !!user,
    placeholderData: opts?.placeholder,
  });
}
