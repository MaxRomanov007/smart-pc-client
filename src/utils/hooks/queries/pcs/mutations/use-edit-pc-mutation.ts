import { pcsApi } from "@/services/pcs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRequireAuth } from "@/lib/auth/use-auth";
import { pcsMutationKeys, pcsQueryKeys } from "@/utils/hooks/queries/pcs";
import type { IPc } from "@/types/pc/pc";
import { redirect } from "@/i18n/navigation";
import { PAGES } from "@/config/navigation/pages";

export function useEditPcMutation(id: string) {
  useRequireAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: pcsMutationKeys.editPc(id),
    mutationFn: pcsApi.editUserPc(),
    onMutate: async (data) => {
      if (!data.slug) {
        return;
      }

      const previousQueryKey = pcsQueryKeys.slugPc(data.slug);

      await queryClient.cancelQueries({
        queryKey: previousQueryKey,
      });
      const previousPc = queryClient.getQueryData<IPc>(previousQueryKey);

      queryClient.setQueryData(
        previousQueryKey,
        (oldData: IPc): IPc => ({
          id: oldData.id,
          slug: oldData.slug,
          name: data.name ?? oldData.name,
          canPowerOn: data.canPowerOn ?? oldData.canPowerOn,
          description: data.description ?? oldData.description,
        }),
      );

      return { previousPc, previousQueryKey };
    },
    onSuccess: (data, _, context) => {
      const queryKey = pcsQueryKeys.slugPc(data.slug);

      queryClient.setQueryData(queryKey, data);

      if (context?.previousPc?.slug !== data.slug) {
        queryClient.removeQueries({ queryKey: context?.previousQueryKey });
        redirect({
          href: PAGES.pc(data.slug),
          locale: "",
        });
      }
    },
    onError: (_0, _1, context) => {
      if (!context) {
        return;
      }

      queryClient.setQueryData(context.previousQueryKey, context.previousPc);
    },
  });
}
