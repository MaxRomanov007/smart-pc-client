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
    const url = new URL(`${pcServiceAddress}/pcs`);
    url.searchParams.set("slug", slug);

    const response = await fetch(url, {
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

interface IPcToPatch {
  id: string;
  name?: string;
  description?: string;
  canPowerOn?: boolean;
}

export async function changeUserPc(
  token: string,
  pc: IPcToPatch,
): Promise<Response<IPc>> {
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
    return data as Response<IPc>;
  } catch (e) {
    return { error: e as Error };
  }
}

export async function fetchUserPcCommands(
  token: string,
  slug: string,
): Promise<Response<IPc>> {
  try {
    const url = new URL(`${pcServiceAddress}/pcs`);
    url.searchParams.set("slug", slug);

    const response = await fetch(url, {
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