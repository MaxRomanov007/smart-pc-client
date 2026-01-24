import type { IPc } from "@/@types/pc/pc";

interface Data<T> {
  data?: T;
  error?: Error;
}

const pcServiceAddress = process.env.PC_SERVICE_ADDRESS

export async function fetchUserPcs(token?: string): Promise<Data<IPc[]>> {
  if (!token) {
    return {};
  }

  try {
    const response = await fetch(pcServiceAddress + "/pcs", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
    const data = await response.json();
    return {data: data as IPc[]}
  } catch (e) {
    return {error: e as Error};
  }
  
}