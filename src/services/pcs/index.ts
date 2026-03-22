import type { IPc } from "@/types/pc/pc";
import type { ApiResponse } from "@/types/api/response";
import { createAxiosInstance } from "@/lib/axios/create-axios-instance";
import { withHandleApiResponse } from "@/lib/axios/with-handle-api-response";

const pcServiceAddress = process.env.NEXT_PUBLIC_PC_SERVICE_ADDRESS;

if (!pcServiceAddress) {
  throw new Error("NEXT_PUBLIC_PC_SERVICE_ADDRESS does not set");
}

const axios = createAxiosInstance(pcServiceAddress);

export const pcsApi = {
  fetchUserPcs: withHandleApiResponse(() => axios.get<IPc[]>("/pcs")),
  fetchUserPcBySlug: withHandleApiResponse((slug: string) =>
    axios.get<ApiResponse<IPc>>("/pcs", {
      params: {
        slug,
      },
    }),
  ),
  changeUserPc: (pc: IPcToPatch) =>
    axios.patch<ApiResponse<IPc>>(`/pcs/${pc.id}`, pc),
} as const;

interface IPcToPatch {
  id: string;
  name?: string;
  description?: string;
  canPowerOn?: boolean;
}

export async function changeUserPc(
  token: string,
  pc: IPcToPatch,
): Promise<ApiResponse<IPc>> {
  try {
    const response = await fetch(`${pcServiceAddress}/pcs/${pc.id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pc),
    });
    const data = await response.json();
    return data as ApiResponse<IPc>;
  } catch (e) {
    return { error: e as string };
  }
}
