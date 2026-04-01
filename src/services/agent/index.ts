import { handleApiResponseQuery } from "@/lib/axios/with-handle-api-response";
import axios from "axios";
import type { IAgentCommand } from "@/types/agent";

const BASE_URL = "http://127.0.0.1";

export const agentApi = {
  fetchCommands: handleApiResponseQuery((port?: number) =>
    axios.get<IAgentCommand[]>(calculateAgentUrl("/commands", port)),
  ),
};

export function calculateAgentUrl(endpoint: string, port: number = 8506) {
  return `${BASE_URL}:${port}${endpoint}`;
}
