import { ToolLoopAgent, createAgentUIStreamResponse, stepCountIs } from "ai";
import { createBashTool } from "bash-tool";
import { Sandbox } from "@vercel/sandbox";
import { SANDBOX_CWD, SYSTEM_INSTRUCTIONS, TOOL_PROMPT } from "./constants";
import { saveSnapshot } from "@/lib/sandbox/saveSnapshot";

type CreateSandbox = (bearerToken: string) => Promise<Sandbox>;

export async function handleAgentRequest(
  req: Request,
  createSandbox: CreateSandbox,
): Promise<Response> {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const bearerToken = authHeader.slice("Bearer ".length);

  const { messages } = await req.json();
  const lastUserMessage = messages
    .filter((m: { role: string }) => m.role === "user")
    .pop();
  console.log("Prompt:", lastUserMessage?.parts?.[0]?.text);

  const sandbox = await createSandbox(bearerToken);

  return createAgentResponse(sandbox, messages, bearerToken);
}

async function createAgentResponse(
  sandbox: Sandbox,
  messages: unknown[],
  bearerToken: string,
): Promise<Response> {
  try {
    const bashToolkit = await createBashTool({
      sandbox,
      destination: SANDBOX_CWD,
      promptOptions: {
        toolPrompt: TOOL_PROMPT,
      },
    });

    const agent = new ToolLoopAgent({
      model: "claude-haiku-4-5",
      instructions: SYSTEM_INSTRUCTIONS,
      tools: {
        bash: bashToolkit.tools.bash,
      },
      stopWhen: stepCountIs(20),
    });

    const response = await createAgentUIStreamResponse({
      agent,
      uiMessages: messages,
    });

    // Clean up sandbox after the stream finishes (not before).
    const body = response.body;
    if (body) {
      const transform = new TransformStream();
      body.pipeTo(transform.writable).finally(() => {
        saveSnapshot(sandbox, bearerToken).finally(() =>
          sandbox.stop().catch(() => {}),
        );
      });
      return new Response(transform.readable, {
        headers: response.headers,
        status: response.status,
      });
    }

    saveSnapshot(sandbox, bearerToken).finally(() =>
      sandbox.stop().catch(() => {}),
    );
    return response;
  } catch (error) {
    saveSnapshot(sandbox, bearerToken).finally(() =>
      sandbox.stop().catch(() => {}),
    );
    throw error;
  }
}
