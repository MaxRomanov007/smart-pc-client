import type { IPc } from "@/types/pc/pc";
import type { Response } from "@/types/services/response";

const pcServiceAddress = process.env.NEXT_PUBLIC_PC_SERVICE_ADDRESS;

export async function fetchUserPcs(token: string): Promise<Response<IPc[]>> {
  if (!token) {
    return {};
  }

  try {
    const response = await fetch(pcServiceAddress + "/pcs", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return data as Response<IPc[]>;
  } catch (e) {
    return { error: e as Error };
  }
}

export async function fetchUserPcBySlug(
  token: string,
  slug: string,
): Promise<Response<IPc>> {
  try {
    const response = await fetch(`${pcServiceAddress}/pcs/${slug}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return data as Response<IPc>;
  } catch (e) {
    return { error: e as Error };
  }
}