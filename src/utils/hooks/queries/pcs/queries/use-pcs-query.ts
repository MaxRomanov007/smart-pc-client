import { useRequireAuth } from "@/lib/auth/use-auth";
import { useQuery } from "@tanstack/react-query";
import { pcsApi } from "@/services/pcs";
import { pcsQueryKeys } from "../keys";

export function usePcsQuery() {
  useRequireAuth();

  return useQuery({
    queryKey: pcsQueryKeys.pcs,
    queryFn: () => pcsApi.fetchUserPcs(),
  });
}
