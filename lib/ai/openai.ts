import "server-only";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
const OPENAI_BASE_URL = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";

export type OpenAIChatMessage = {
  role: "system" | "user" | "assistant" | "tool";
  content: string;
  name?: string;
};

export async function streamChatCompletion(args: {
  model?: string;
  messages: any[];
  tools?: any[];
  tool_choice?: "auto" | { type: string };
}): Promise<Response> {
  if (!OPENAI_API_KEY) throw new Error("Missing OPENAI_API_KEY");
  return fetch(`${OPENAI_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: args.model || "gpt-4o-mini",
      stream: true,
      messages: args.messages,
      tools: args.tools,
      tool_choice: args.tool_choice || "auto",
    }),
  });
}


