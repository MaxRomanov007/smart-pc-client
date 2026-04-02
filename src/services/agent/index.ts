import {
  handleApiResponseParametrized,
  handleApiResponseQuery,
} from "@/lib/axios/with-handle-api-response";
import axios from "axios";
import type { IAgentCommand } from "@/types/agent";
import type { ApiResponse } from "@/types/api/response";
import type { PartialExcept } from "@/utils/types";

const BASE_URL = "http://127.0.0.1";

export const agentApi = {
  fetchCommands: handleApiResponseQuery((port?: number) =>
    axios.get<IAgentCommand[]>(calculateAgentUrl("/commands", port)),
  ),
  deleteCommand: handleApiResponseParametrized((commandId: string) =>
    axios.delete<ApiResponse<IAgentCommand>>(
      calculateAgentUrl(`/commands/${commandId}`),
    ),
  ),
  editCommand: handleApiResponseParametrized((command: AgentCommandToEdit) =>
    axios.patch<ApiResponse<IAgentCommand>>(
      calculateAgentUrl(`/commands/${command.id}`),
      command,
    ),
  ),
};

export type AgentCommandToEdit = PartialExcept<IAgentCommand, "id">;

export function calculateAgentUrl(endpoint: string, port: number = 8506) {
  return `${BASE_URL}:${port}${endpoint}`;
}
