import { NextRequest } from "next/server"
import { createClient as createSupabaseServer } from "@/lib/supabase/server"
import LONNIEE_SYSTEM_PROMPT from "@/lib/ai/system-prompts"
import { toolSchemas, toolImplMap } from "@/lib/lonniee/tools"
import { getOpenAIConfig } from "@/lib/ai/openai"

type ChatBody = {
  threadId?: string
  message?: string
  approval?: { proposalId: string; tool: string; args: any; idempotency_key: string }
}

export const runtime = "nodejs"

export async function POST(req: NextRequest) {
  const supabase = await createSupabaseServer()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return new Response("Unauthorized", { status: 401 })

  const body = (await req.json()) as ChatBody
  const conversationId = await getOrCreateConversationId(supabase, user.id, body.threadId)

  if (body.message) {
    await insertMessage(supabase, conversationId, "user", { text: body.message })
  }

  if (body.approval) {
    const { tool, args, idempotency_key } = body.approval
    const argsWithIdem = { ...(args || {}), idempotency_key }
    const result = await executeTool(conversationId, tool, argsWithIdem, supabase)
    await insertMessage(supabase, conversationId, "tool", { name: tool, args: argsWithIdem, result })
  }

  const stream = new ReadableStream<Uint8Array>({
    start: async (controller) => {
      const encoder = new TextEncoder()
      const send = (event: string, data: any) => {
        controller.enqueue(encoder.encode(`event: ${event}\n`))
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
      }

      try {
        send("meta", { threadId: conversationId })

        const messagesForModel = await buildMessagesForModel(supabase, conversationId)
        const { apiKey, baseUrl, defaultModel } = getOpenAIConfig()

        const response = await fetch(`${baseUrl}/chat/completions`, {
          method: "POST",
          headers: { Authorization: `Bearer ${apiKey}`, "content-type": "application/json" },
          body: JSON.stringify({
            model: defaultModel,
            stream: true,
            messages: [{ role: "system", content: LONNIEE_SYSTEM_PROMPT }, ...messagesForModel],
            tools: toolSchemas,
            tool_choice: "auto",
          }),
        })
        if (!response.ok || !response.body) {
          const text = await response.text().catch(() => "")
          throw new Error(`OpenAI error: ${response.status} ${text}`)
        }

        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let assistantAccumulated = ""
        let toolCallBuffer: { name: string; arguments: string } | null = null

        while (true) {
          const { value, done } = await reader.read()
          if (done) break
          const chunk = decoder.decode(value, { stream: true })
          for (const line of chunk.split("\n")) {
            const trimmed = line.trim()
            if (!trimmed) continue
            if (!trimmed.startsWith("data:")) continue
            const jsonStr = trimmed.replace(/^data:\s*/, "")
            if (jsonStr === "[DONE]") continue
            let payload: any
            try { payload = JSON.parse(jsonStr) } catch { continue }

            const delta = payload.choices?.[0]?.delta
            const finishReason = payload.choices?.[0]?.finish_reason

            if (delta?.tool_calls?.length) {
              const tc = delta.tool_calls[0]
              if (tc.function) {
                toolCallBuffer = { name: tc.function.name, arguments: tc.function.arguments || "{}" }
              }
            }

            if (delta?.content) {
              assistantAccumulated += delta.content
              send("message", { type: "delta", content: delta.content })
            }

            if (finishReason === "tool_calls" && toolCallBuffer) {
              const args = parseJsonSafe(toolCallBuffer.arguments)
              if (toolCallBuffer.name === "proposeAction") {
                const proposal = {
                  proposalId: args.proposalId || crypto.randomUUID(),
                  tool: args.tool,
                  args: args.args,
                  preview: args.preview,
                }
                await insertMessage(supabase, conversationId, "assistant", { preview: proposal })
                send("actionPreview", proposal)
              } else {
                const result = await executeTool(conversationId, toolCallBuffer.name, args, supabase)
                await insertMessage(supabase, conversationId, "tool", { name: toolCallBuffer.name, args, result })
                send("tool", { name: toolCallBuffer.name, result })
              }
            }

            if (finishReason === "stop") {
              if (assistantAccumulated.trim()) {
                await insertMessage(supabase, conversationId, "assistant", { text: assistantAccumulated })
              }
              break
            }
          }
        }

        controller.close()
      } catch (err: any) {
        const message = err?.message || "Unknown error"
        controller.enqueue(new TextEncoder().encode(`event: error\n`))
        controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ message })}\n\n`))
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      "content-type": "text/event-stream",
      "cache-control": "no-cache, no-transform",
      connection: "keep-alive",
      "x-accel-buffering": "no",
    },
  })
}

function parseJsonSafe(input: string) {
  try {
    return JSON.parse(input || "{}")
  } catch {
    return {}
  }
}

async function getOrCreateConversationId(supabase: any, userId: string, threadId?: string) {
  if (threadId) return threadId
  const { data, error } = await supabase
    .from("conversations")
    .insert({ user_id: userId, agent: "lonniee" })
    .select("id")
    .single()
  if (error) throw error
  return data.id as string
}

async function insertMessage(supabase: any, conversationId: string, role: "user" | "assistant" | "tool", content: any) {
  const { error } = await supabase.from("messages").insert({ conversation_id: conversationId, role, content })
  if (error) throw error
}

async function logAgentAction(supabase: any, conversationId: string, tool_name: string, args: any, result: any) {
  const { error } = await supabase.from("agent_actions").insert({ conversation_id: conversationId, tool_name, args, result })
  if (error) throw error
}

async function enforceRateLimit(supabase: any, conversationId: string) {
  const { data, error } = await supabase
    .from("agent_actions")
    .select("id, created_at")
    .eq("conversation_id", conversationId)
    .gte("created_at", new Date(Date.now() - 60_000).toISOString())
  if (error) throw error
  if ((data?.length || 0) >= 5) throw new Error("I’m doing too much—try again in a bit.")
}

async function executeTool(conversationId: string, name: string, args: any, supabase: any) {
  const impl = toolImplMap[name]
  if (!impl) throw new Error(`Unknown tool: ${name}`)
  await enforceRateLimit(supabase, conversationId)
  const started = Date.now()
  try {
    const result = await impl(args)
    const latency_ms = Date.now() - started
    await logAgentAction(supabase, conversationId, name, { ...args, _latency_ms: latency_ms }, result)
    return result
  } catch (e: any) {
    const latency_ms = Date.now() - started
    await logAgentAction(supabase, conversationId, name, { ...args, _latency_ms: latency_ms }, { ok: false, error: e?.message || "failed" })
    throw e
  }
}

async function buildMessagesForModel(supabase: any, conversationId: string) {
  const { data, error } = await supabase
    .from("messages")
    .select("role, content, created_at")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true })
  if (error) throw error
  const messages = (data || []).map((m: any) => {
    if (m.role === "tool") return { role: "tool", content: JSON.stringify(m.content) }
    return { role: m.role, content: m.content?.text || JSON.stringify(m.content) }
  })
  return messages
}

