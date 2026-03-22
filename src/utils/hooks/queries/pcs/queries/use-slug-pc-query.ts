import { useRequireAuth } from "@/lib/auth/use-auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { pcsQueryKeys } from "@/utils/hooks/queries/pcs";
import { pcsApi } from "@/services/pcs";
import type { IPc } from "@/types/pc/pc";

export function useSlugPcQuery(slug: string) {
  useRequireAuth();
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: pcsQueryKeys.slugPc(slug),
    queryFn: () =>
      pcsApi.fetchUserPcBySlug(slug, {
        errors: {
          notFound: {
            message: "Hello",
            title: "Hello hello",
            block: true,
          },
        },
      }),
    placeholderData: () => {
      const pcs = queryClient.getQueryData<IPc[]>(pcsQueryKeys.pcs);

      return pcs?.find((pc) => pc.slug === slug);
    },
  });
}
