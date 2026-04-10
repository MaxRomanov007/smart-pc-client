import { useRequireAuth } from "@/lib/auth/use-auth";
import { useQuery } from "@tanstack/react-query";
import { useExtracted } from "next-intl";
import { pcsQueryKeys } from "@/utils/hooks/queries/pcs";
import { pcsApi } from "@/services/pcs";

export function useIdPcQuery(id?: string) {
  const { user } = useRequireAuth();
  const t = useExtracted("use-pc-query");

  return useQuery({
    queryKey: pcsQueryKeys.idPc(id ?? ""),
    queryFn: pcsApi.fetchPcById(user?.id ?? "", id ?? "", {
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
    enabled: !!id && !!user,
  });
}
