import { useRequireAuth } from "@/lib/auth/use-auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { pcsMutationKeys, pcsQueryKeys } from "@/utils/hooks/queries/pcs";
import { pcsApi } from "@/services/pcs";
import type { IPc } from "@/types/pc/pc";

export function useDeletePcMutation(id: string) {
  const { user } = useRequireAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: pcsMutationKeys.deletePc(id),
    mutationFn: () => pcsApi.deletePc()(user?.id ?? "", id),
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: pcsQueryKeys.pcs,
      });
      const previousPcs = queryClient.getQueryData<IPc[]>(pcsQueryKeys.pcs);

      queryClient.setQueryData<IPc[]>(
        pcsQueryKeys.pcs,
        (oldData: IPc[] | undefined): IPc[] | undefined =>
          oldData?.filter((pc) => pc.id !== id),
      );

      return { previousPcs };
    },
    onError: (_0, _1, context) => {
      if (!context) {
        return;
      }

      queryClient.setQueryData(pcsQueryKeys.pcs, context.previousPcs);
    },
  });
}
