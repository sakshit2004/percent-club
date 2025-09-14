import { NextRequest } from "next/server";
import { createClient as createSupabaseServer } from "@/lib/supabase/server";
import LONNIEE_SYSTEM_PROMPT from "@/lib/ai/system-prompts";
import { streamChatCompletion } from "@/lib/ai/openai";
import { toolSchemas, toolImplMap } from "@/lib/lonniee/tools";

type ChatBody = {
  threadId?: string;
  message?: string;
  approval?: { proposalId: string; tool: string; args: any; idempotency_key: string };
};

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const body = (await req.json()) as ChatBody;
  const conversationId = await getOrCreateConversationId(supabase, user.id, body.threadId);

  if (body.message) {
    await insertMessage(supabase, conversationId, "user", { text: redactPII(body.message) });
  }

  if (body.approval) {
    const { proposalId, tool, args, idempotency_key } = body.approval;
    if (!idempotency_key) return new Response("idempotency_key required", { status: 400 });
    const result = await executeTool(conversationId, tool, { ...args, idempotency_key }, supabase);
    await insertMessage(supabase, conversationId, "tool", { name: tool, args, result, proposalId });
  }

  const stream = new ReadableStream<Uint8Array>({
    start: async (controller) => {
      const encoder = new TextEncoder();
      const send = (event: string, data: any) => {
        controller.enqueue(encoder.encode(`event: ${event}\n`));
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      try {
        send("meta", { threadId: conversationId });

        const messagesForModel = await buildMessagesForModel(supabase, conversationId);
        const resp = await streamChatCompletion({
          messages: [{ role: "system", content: LONNIEE_SYSTEM_PROMPT }, ...messagesForModel],
          tools: toolSchemas,
          tool_choice: "auto",
        });
        if (!resp.ok || !resp.body) {
          const text = await resp.text().catch(() => "");
          throw new Error(`OpenAI error: ${resp.status} ${text}`);
        }

        const reader = resp.body.getReader();
        const decoder = new TextDecoder();
        let assistantAccum = "";
        let toolCall: { name: string; arguments: string } | null = null;

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          for (const line of chunk.split("\n")) {
            const trimmed = line.trim();
            if (!trimmed || !trimmed.startsWith("data:")) continue;
            const payloadStr = trimmed.replace(/^data:\s*/, "");
            if (payloadStr === "[DONE]") continue;
            let payload: any;
            try { payload = JSON.parse(payloadStr); } catch { continue; }
            const choice = payload.choices?.[0];
            const delta = choice?.delta;
            const finishReason = choice?.finish_reason;

            if (delta?.tool_calls?.length) {
              const tc = delta.tool_calls[0];
              if (tc.function) {
                toolCall = { name: tc.function.name, arguments: tc.function.arguments || "{}" };
              }
            }

            if (delta?.content) {
              assistantAccum += delta.content;
              send("message", { type: "delta", content: delta.content });
            }

            if (finishReason === "tool_calls" && toolCall) {
              const args = parseJsonSafe(toolCall.arguments);
              if (toolCall.name === "proposeAction") {
                const proposal = {
                  proposalId: args.proposalId || crypto.randomUUID(),
                  tool: args.tool,
                  args: args.args,
                  preview: args.preview,
                };
                await insertMessage(supabase, conversationId, "assistant", { preview: proposal });
                send("actionPreview", proposal);
              } else {
                const result = await executeTool(conversationId, toolCall.name, args, supabase);
                await insertMessage(supabase, conversationId, "tool", { name: toolCall.name, args, result });
                send("tool", { name: toolCall.name, result });
              }
            }

            if (finishReason === "stop") {
              if (assistantAccum.trim()) {
                await insertMessage(supabase, conversationId, "assistant", { text: assistantAccum });
              }
            }
          }
        }

        controller.close();
      } catch (e: any) {
        const message = e?.message || "Unknown error";
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
  try { return JSON.parse(input || "{}"); } catch { return {}; }
}

async function getOrCreateConversationId(supabase: any, userId: string, threadId?: string) {
  if (threadId) return threadId;
  const { data, error } = await supabase
    .from("conversations")
    .insert({ user_id: userId, agent: "lonniee" })
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

async function enforceRateLimit(supabase: any, conversationId: string) {
  const { data, error } = await supabase
    .from("agent_actions")
    .select("id, created_at")
    .eq("conversation_id", conversationId)
    .gte("created_at", new Date(Date.now() - 60_000).toISOString());
  if (error) throw error;
  if ((data?.length || 0) >= 5) throw new Error("I’m doing too much—try again in a bit.");
}

async function executeTool(conversationId: string, name: string, args: any, supabase: any) {
  const impl = toolImplMap[name];
  if (!impl) throw new Error(`Unknown tool: ${name}`);
  await enforceRateLimit(supabase, conversationId);
  const result = await impl(args);
  await logAgentAction(supabase, conversationId, name, sanitizeArgs(args), summarizeResult(result));
  return compactOk(result);
}

function compactOk(result: any) {
  if (result && typeof result === "object" && "ok" in result) return result;
  return { ok: true, details: result };
}

function sanitizeArgs(args: any) {
  try {
    const cleaned = { ...args };
    if (cleaned.note && typeof cleaned.note === "string") cleaned.note = "[redacted_note]";
    return cleaned;
  } catch { return {}; }
}

function redactPII(text: string): string {
  // Lightweight redaction: remove emails and 16+ digit sequences
  return text
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[redacted_email]")
    .replace(/\b\d{12,}\b/g, "[redacted_number]");
}

async function buildMessagesForModel(supabase: any, conversationId: string) {
  const { data, error } = await supabase
    .from("messages")
    .select("role, content, created_at")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data || []).map((m: any) => {
    if (m.role === "tool") return { role: "tool", content: JSON.stringify(m.content) };
    return { role: m.role, content: m.content?.text || JSON.stringify(m.content) };
  });
}


