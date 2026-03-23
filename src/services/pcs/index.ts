import type { IPc } from "@/types/pc/pc";
import type { ApiResponse } from "@/types/api/response";
import { createAxiosInstance } from "@/lib/axios/create-axios-instance";
import {
  handleApiResponseMutation,
  handleApiResponseQuery,
} from "@/lib/axios/with-handle-api-response";

const pcServiceAddress = process.env.NEXT_PUBLIC_PC_SERVICE_ADDRESS;

if (!pcServiceAddress) {
  throw new Error("NEXT_PUBLIC_PC_SERVICE_ADDRESS does not set");
}

const axios = createAxiosInstance(pcServiceAddress);

export const pcsApi = {
  fetchUserPcs: handleApiResponseQuery(() => axios.get<IPc[]>("/pcs")),
  fetchUserPcBySlug: handleApiResponseQuery((slug: string) =>
    axios.get<ApiResponse<IPc>>("/pcs", {
      params: {
        slug,
      },
    }),
  ),
  editUserPc: handleApiResponseMutation((pc: PcToEdit) =>
    axios.patch<ApiResponse<IPc>>(`/pcs/${pc.id}`, pc),
  ),
} as const;

export type PcToEdit = { id: string } & Partial<Omit<IPc, "id">>;
