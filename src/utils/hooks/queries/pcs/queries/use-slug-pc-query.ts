import { useRequireAuth } from "@/lib/auth/use-auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { pcsQueryKeys } from "@/utils/hooks/queries/pcs";
import { pcsApi } from "@/services/pcs";
import type { IPc } from "@/types/pc/pc";

export function useSlugPcQuery(slug: string) {
  const { user } = useRequireAuth();
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: pcsQueryKeys.slugPc(slug),
    queryFn: pcsApi.fetchPcBySlug(user?.id ?? "", slug),
    enabled: !!user,
    placeholderData: () => {
      const pcs = queryClient.getQueryData<IPc[]>(pcsQueryKeys.pcs);

      return pcs?.find((pc) => pc.slug === slug);
    },
  });
}
