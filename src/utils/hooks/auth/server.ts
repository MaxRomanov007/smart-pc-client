import { cookies } from "next/headers";
import { ACCESS_TOKEN_COOKIE } from "@/config/storage/cookie";

export async function getAuthToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
}
