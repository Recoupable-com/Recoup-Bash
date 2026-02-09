import { createNewSandbox } from "@/lib/sandbox/createNewSandbox";
import { handleAgentRequest } from "@/lib/agent/createAgentResponse";
import { AGENT_DATA_DIR } from "@/lib/agent/constants";

export async function POST(req: Request) {
  return handleAgentRequest(req, (bearerToken) =>
    createNewSandbox(bearerToken, AGENT_DATA_DIR),
  );
}
