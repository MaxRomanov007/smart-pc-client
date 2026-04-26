import type { IPc } from "@/types/pc/pc";
import type { ApiResponse } from "@/types/api/response";
import { createAxiosInstance } from "@/lib/axios/create-axios-instance";
import {
  handleApiResponseInfiniteQueryMapped,
  handleApiResponseParametrized,
  handleApiResponseQuery,
  handleApiResponseQueryMapped,
} from "@/lib/axios/with-handle-api-response";
import type { ICommand } from "@/types/pc/command";
import type { CommandParameter } from "@/types/pc/command-parameter";
import { initializeParameter } from "@/services/pcs/initialize-parameter";
import type { IPcLog } from "@/types/pc/pc-log";
import type { PartialExcept } from "@/utils/types";
import { initializeLog } from "@/services/pcs/initialize-log";

const pcServiceAddress = process.env.NEXT_PUBLIC_PC_SERVICE_ADDRESS;

if (!pcServiceAddress) {
  throw new Error("NEXT_PUBLIC_PC_SERVICE_ADDRESS does not set");
}

const axios = createAxiosInstance(pcServiceAddress);

export const pcsApi = {
  fetchPcs: handleApiResponseQuery((uid: string) =>
    axios.get<IPc[]>(`/u/${uid}/pcs`),
  ),
  fetchPcBySlug: handleApiResponseQuery((uid: string, slug: string) =>
    axios.get<ApiResponse<IPc>>(`/u/${uid}/pcs`, {
      params: {
        slug,
      },
    }),
  ),
  fetchPcById: handleApiResponseQuery((uid: string, id: string) =>
    axios.get<IPc>(`/u/${uid}/pcs/${id}`),
  ),
  editPc: handleApiResponseParametrized((uid: string, pc: PcToEdit) =>
    axios.patch<ApiResponse<IPc>>(`/u/${uid}/pcs/${pc.id}`, pc),
  ),
  deletePc: handleApiResponseParametrized((uid: string, pcId: string) =>
    axios.delete<ApiResponse<IPc>>(`/u/${uid}/pcs/${pcId}`),
  ),

  fetchPcLogs: handleApiResponseInfiniteQueryMapped(
    (
      uid: string,
      pcId: string,
      limit: number = 20,
      order: Order = "asc",
      cursor?: string,
    ) =>
      axios.get<IPcLog[]>(`/u/${uid}/pcs/${pcId}/logs`, {
        params: {
          limit,
          order,
          after: cursor,
        },
      }),
    (logs) => logs.map(initializeLog),
  ),

  fetchPcCommands: handleApiResponseQuery((uid: string, pcId: string) =>
    axios.get<ICommand[]>(`/u/${uid}/pcs/${pcId}/commands`),
  ),

  fetchPcCommandParameters: handleApiResponseQueryMapped(
    (uid: string, pcId: string, commandId: string) =>
      axios.get<CommandParameter[]>(
        `/u/${uid}/pcs/${pcId}/commands/${commandId}/parameters`,
      ),
    (params) => params.map(initializeParameter),
  ),
} as const;

export type PcToEdit = PartialExcept<IPc, "id">;
export type Order = "asc" | "desc";
