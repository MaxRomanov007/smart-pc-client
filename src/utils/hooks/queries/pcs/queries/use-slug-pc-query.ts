import { useRequireAuth } from "@/lib/auth/use-auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { pcsQueryKeys } from "@/utils/hooks/queries/pcs";
import { pcsApi } from "@/services/pcs";
import type { IPc } from "@/types/pc/pc";
import { useExtracted } from "next-intl";

export function useSlugPcQuery(slug: string) {
  useRequireAuth();
  const queryClient = useQueryClient();
  const t = useExtracted("use-slug-pc-query");

  return useQuery({
    queryKey: pcsQueryKeys.slugPc(slug),
    queryFn: pcsApi.fetchPcBySlug(slug, {
      errors: {
        notFound: {
          title: t({
            message: "PC not found",
            description: "not found error title",
          }),
          message: t({
            message: "This PC can not be found",
            description: "not found error message",
          }),
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
