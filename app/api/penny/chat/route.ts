import { NextRequest } from "next/server";
import { createClient as createSupabaseServer } from "@/lib/supabase/server";
import PENNY_SYSTEM_PROMPT from "@/lib/penny/prompt";
import { toolSchemas, toolImplMap } from "@/lib/penny/tools";

// Use native fetch with OpenAI Responses/Chat Completions-compatible streaming
const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;
const OPENAI_BASE_URL = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";

type ChatBody = {
  threadId?: string;
  message?: string;
  approved?: boolean;
  proposal?: {
    id: string;
    tool: string;
    args: any;
  };
};

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = (await req.json()) as ChatBody;
  const conversationId = await getOrCreateConversationId(supabase, user.id, body.threadId);

  // Record inbound user message or approval
  if (body.message) {
    await insertMessage(supabase, conversationId, "user", { text: body.message });
  }

  if (body.approved && body.proposal) {
    // Execute the approved tool call server-side
    const result = await executeTool(conversationId, body.proposal.tool, body.proposal.args, supabase);
    await insertMessage(supabase, conversationId, "tool", {
      name: body.proposal.tool,
      args: body.proposal.args,
      result,
    });
  }

  // Prepare SSE stream to client
  const stream = new ReadableStream<Uint8Array>({
    start: async (controller) => {
      const encoder = new TextEncoder();
      const send = (event: string, data: any) => {
        controller.enqueue(encoder.encode(`event: ${event}\n`));
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      try {
        // Announce conversation id to client
        send("meta", { threadId: conversationId });

        // Build messages for OpenAI from conversation history
        const messagesForModel = await buildMessagesForModel(supabase, conversationId);

        // Kick off model call with tools
        const response = await fetch(`${OPENAI_BASE_URL}/chat/completions`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            stream: true,
            messages: [
              { role: "system", content: PENNY_SYSTEM_PROMPT },
              ...messagesForModel,
            ],
            tools: toolSchemas,
            tool_choice: "auto",
          }),
        });

        if (!response.ok || !response.body) {
          const text = await response.text().catch(() => "");
          throw new Error(`OpenAI error: ${response.status} ${text}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let assistantAccumulated = "";
        let toolCallBuffer: { name: string; arguments: string } | null = null;

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });

          for (const line of chunk.split("\n")) {
            const trimmed = line.trim();
            if (!trimmed) continue;
            if (!trimmed.startsWith("data:")) continue;
            const jsonStr = trimmed.replace(/^data:\s*/, "");
            if (jsonStr === "[DONE]") continue;
            let payload: any;
            try {
              payload = JSON.parse(jsonStr);
            } catch {
              continue;
            }

            const delta = payload.choices?.[0]?.delta;
            const finishReason = payload.choices?.[0]?.finish_reason;

            if (delta?.tool_calls?.length) {
              const tc = delta.tool_calls[0];
              if (tc.function) {
                toolCallBuffer = {
                  name: tc.function.name,
                  arguments: tc.function.arguments || "{}",
                };
              }
            }

            if (delta?.content) {
              assistantAccumulated += delta.content;
              send("message", { type: "delta", content: delta.content });
            }

            if (finishReason === "tool_calls" && toolCallBuffer) {
              // Execute tool
              const args = parseJsonSafe(toolCallBuffer.arguments);
              if (toolCallBuffer.name === "proposeAction") {
                const proposal = {
                  proposalId: args.proposalId || crypto.randomUUID(),
                  tool: args.tool,
                  args: args.args,
                  preview: args.preview,
                };
                await insertMessage(supabase, conversationId, "assistant", { preview: proposal });
                send("actionPreview", proposal);
              } else {
                const result = await executeTool(conversationId, toolCallBuffer.name, args, supabase);
                await insertMessage(supabase, conversationId, "tool", {
                  name: toolCallBuffer.name,
                  args,
                  result,
                });
                send("tool", { name: toolCallBuffer.name, result });
              }
            }

            if (finishReason === "stop") {
              if (assistantAccumulated.trim()) {
                await insertMessage(supabase, conversationId, "assistant", { text: assistantAccumulated });
              }
              break;
            }
          }
        }

        controller.close();
      } catch (err: any) {
        const message = err?.message || "Unknown error";
        const encoder = new TextEncoder();
        controller.enqueue(encoder.encode(`event: error\n`));
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ message })}\n\n`));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "content-type": "text/event-stream",
      "cache-control": "no-cache, no-transform",
      connection: "keep-alive",
      "x-accel-buffering": "no",
    },
  });
}

function parseJsonSafe(input: string) {
  try {
    return JSON.parse(input || "{}");
  } catch {
    return {};
  }
}

async function getOrCreateConversationId(supabase: any, userId: string, threadId?: string) {
  if (threadId) return threadId;
  const { data, error } = await supabase
    .from("conversations")
    .insert({ user_id: userId, agent: "penny" })
    .select("id")
    .single();
  if (error) throw error;
  return data.id as string;
}

async function insertMessage(supabase: any, conversationId: string, role: "user" | "assistant" | "tool", content: any) {
  const { error } = await supabase.from("messages").insert({ conversation_id: conversationId, role, content });
  if (error) throw error;
}

async function logAgentAction(supabase: any, conversationId: string, tool_name: string, args: any, result: any) {
  const { error } = await supabase.from("agent_actions").insert({ conversation_id: conversationId, tool_name, args, result });
  if (error) throw error;
}

async function executeTool(conversationId: string, name: string, args: any, supabase: any) {
  const impl = toolImplMap[name];
  if (!impl) throw new Error(`Unknown tool: ${name}`);
  // Basic rate limit per conversation: 5/min
  await enforceRateLimit(supabase, conversationId);
  const result = await impl(args);
  await logAgentAction(supabase, conversationId, name, args, result);
  return result;
}

async function enforceRateLimit(supabase: any, conversationId: string) {
  const { data, error } = await supabase
    .from("agent_actions")
    .select("id, created_at")
    .eq("conversation_id", conversationId)
    .gte("created_at", new Date(Date.now() - 60_000).toISOString());
  if (error) throw error;
  if ((data?.length || 0) >= 5) {
    throw new Error("Too many actions, please try again in a minute.");
  }
}

async function buildMessagesForModel(supabase: any, conversationId: string) {
  const { data, error } = await supabase
    .from("messages")
    .select("role, content, created_at")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });
  if (error) throw error;

  const messages = (data || []).map((m: any) => {
    if (m.role === "tool") {
      return {
        role: "tool",
        content: JSON.stringify(m.content),
      };
    }
    return { role: m.role, content: m.content?.text || JSON.stringify(m.content) };
  });
  return messages;
}

