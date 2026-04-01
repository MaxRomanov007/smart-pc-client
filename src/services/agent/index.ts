import { handleApiResponseQuery } from "@/lib/axios/with-handle-api-response";
import axios from "axios";

const BASE_URL = "127.0.0.1";

export const agentApi = {
  fetchInfo: handleApiResponseQuery((port?: number) =>
    axios.get<{ id: string }>(calculateAgentUrl("/info", port)),
  ),
};

export function calculateAgentUrl(endpoint: string, port: number = 8506) {
  return `${BASE_URL}/${port}${endpoint}`;
}
