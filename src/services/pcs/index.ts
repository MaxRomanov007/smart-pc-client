import type { IPc } from "@/types/pc/pc";
import type { ApiResponse } from "@/types/api/response";
import { createAxiosInstance } from "@/lib/axios/create-axios-instance";
import {
  handleApiResponseMutation,
  handleApiResponseQuery,
  handleApiResponseQueryMapped,
} from "@/lib/axios/with-handle-api-response";
import type { ICommand } from "@/types/pc/command";
import type { CommandParameter } from "@/types/pc/command-parameter";
import { initializeParameter } from "@/services/pcs/initialize-parameter";

const pcServiceAddress = process.env.NEXT_PUBLIC_PC_SERVICE_ADDRESS;

if (!pcServiceAddress) {
  throw new Error("NEXT_PUBLIC_PC_SERVICE_ADDRESS does not set");
}

const axios = createAxiosInstance(pcServiceAddress);

export const pcsApi = {
  fetchPcs: handleApiResponseQuery(() => axios.get<IPc[]>("/pcs")),
  fetchPcBySlug: handleApiResponseQuery((slug: string) =>
    axios.get<ApiResponse<IPc>>("/pcs", {
      params: {
        slug,
      },
    }),
  ),
  editPc: handleApiResponseMutation((pc: PcToEdit) =>
    axios.patch<ApiResponse<IPc>>(`/pcs/${pc.id}`, pc),
  ),

  fetchPcCommands: handleApiResponseQuery((pcId: string) =>
    axios.get<ICommand[]>(`/pcs/${pcId}/commands`),
  ),

  fetchPcCommandParameters: handleApiResponseQueryMapped(
    (pcId: string, commandId: string) =>
      axios.get<CommandParameter[]>(
        `/pcs/${pcId}/commands/${commandId}/parameters`,
      ),
    (params) => params.map(initializeParameter),
  ),
} as const;

export type PcToEdit = { id: string } & Partial<Omit<IPc, "id">>;
