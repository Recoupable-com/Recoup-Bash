import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { createFreshSandbox } from "@/lib/sandbox/createFreshSandbox";
import { handleAgentRequest } from "@/lib/agent/createAgentResponse";

const __dirname = dirname(fileURLToPath(import.meta.url));
const AGENT_DATA_DIR = join(__dirname, "../_agent-data");

export async function POST(req: Request) {
  return handleAgentRequest(req, () => createFreshSandbox(AGENT_DATA_DIR));
}
