import "server-only"

type HttpMethod = "GET" | "POST" | "PATCH"

const APP_BASE_URL = process.env.APP_BASE_URL || "http://localhost:3000"
const PLAID_MCP_BASE_URL = process.env.PLAID_MCP_BASE_URL || "http://localhost:3333"
const PLAID_MCP_API_KEY = process.env.PLAID_MCP_API_KEY || ""

async function http<T>(url: string, method: HttpMethod, body?: any, headers?: Record<string, string>, timeoutMs = 8000): Promise<T> {
  const controller = new AbortController()
  const to = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(url, {
      method,
      headers: { "content-type": "application/json", ...(headers || {}) },
      body: body ? JSON.stringify(body) : undefined,
      cache: "no-store",
      signal: controller.signal,
    })
    if (!res.ok) {
      const text = await res.text().catch(() => "")
      throw new Error(`HTTP ${res.status} ${res.statusText} for ${url}: ${text}`)
    }
    const contentType = res.headers.get("content-type") || ""
    if (contentType.includes("application/json")) return (await res.json()) as T
    return (await res.text()) as unknown as T
  } finally {
    clearTimeout(to)
  }
}

// Plaid MCP helpers (dev/staging)
export async function plaid_createPublicToken(args: { institution_id: string; products?: string[]; country_codes?: string[] }): Promise<{ public_token: string }> {
  const url = `${PLAID_MCP_BASE_URL}/sandbox/public_token/create`
  return http(url, "POST", args, PLAID_MCP_API_KEY ? { Authorization: `Bearer ${PLAID_MCP_API_KEY}` } : undefined)
}

export async function plaid_fireTransactionsWebhook(args: { item_id: string }): Promise<{ status: string }> {
  const url = `${PLAID_MCP_BASE_URL}/sandbox/transactions/webhook/fire`
  return http(url, "POST", args, PLAID_MCP_API_KEY ? { Authorization: `Bearer ${PLAID_MCP_API_KEY}` } : undefined)
}

export async function plaid_setItemLoginRequired(args: { item_id: string }): Promise<{ status: string }> {
  const url = `${PLAID_MCP_BASE_URL}/sandbox/item/login_required/set`
  return http(url, "POST", args, PLAID_MCP_API_KEY ? { Authorization: `Bearer ${PLAID_MCP_API_KEY}` } : undefined)
}

// App API helpers (server-to-server)
export async function app_exchangePublicToken(args: { public_token: string; institution_name?: string }) {
  return http(`${APP_BASE_URL}/api/plaid/exchange`, "POST", args)
}

export async function app_syncTransactions(args: { item_id?: string } = {}) {
  return http(`${APP_BASE_URL}/api/sync/transactions`, "POST", args)
}

export async function app_syncRecurring(args: { item_id?: string } = {}) {
  return http(`${APP_BASE_URL}/api/sync/recurring`, "POST", args)
}

export async function app_getInstitutions() {
  return http(`${APP_BASE_URL}/api/plaid/institutions`, "GET")
}

export async function app_getRoundups() {
  return http(`${APP_BASE_URL}/api/data/roundups`, "GET")
}

export async function app_postRoundups(args: { user_challenge_id: string; pod_id: string; amount_cents: number; idempotency_key: string }) {
  return http(`${APP_BASE_URL}/api/events/post-roundups`, "POST", args)
}

export async function app_getRecurring() {
  return http(`${APP_BASE_URL}/api/data/recurring`, "GET")
}

export async function app_recordSavings(args: { pod_id: string; amount_cents: number; source: string; note?: string; idempotency_key: string }) {
  return http(`${APP_BASE_URL}/api/events/record-savings`, "POST", args)
}

export async function app_getPods() {
  return http(`${APP_BASE_URL}/api/pods`, "GET")
}

export async function app_getUserChallenges() {
  return http(`${APP_BASE_URL}/api/user-challenges`, "GET")
}

export async function app_startChallenge(args: { challengeKey: string; sinkPodId: string; idempotency_key: string }) {
  return http(`${APP_BASE_URL}/api/user-challenges`, "POST", args)
}

export async function app_updateChallenge(args: { id: string; status?: string; sinkPodId?: string; idempotency_key: string }) {
  return http(`${APP_BASE_URL}/api/user-challenges/${args.id}`, "PATCH", { status: args.status, sinkPodId: args.sinkPodId, idempotency_key: args.idempotency_key })
}

// OpenAI tool/function registration schemas
export const toolSchemas = [
  {
    type: "function",
    function: {
      name: "proposeAction",
      description: "Propose approval-required action. Client renders approval UI; do not change state directly.",
      parameters: {
        type: "object",
        properties: {
          proposalId: { type: "string" },
          tool: { type: "string" },
          args: { type: "object" },
          preview: { type: "string" },
        },
        required: ["tool", "args", "preview"],
      },
    },
  },
  { type: "function", function: { name: "plaid_createPublicToken", description: "Create Plaid Sandbox public token", parameters: { type: "object", properties: { institution_id: { type: "string" }, products: { type: "array", items: { type: "string" } }, country_codes: { type: "array", items: { type: "string" } } }, required: ["institution_id"] } } },
  { type: "function", function: { name: "plaid_fireTransactionsWebhook", description: "Trigger transactions webhook (Sandbox)", parameters: { type: "object", properties: { item_id: { type: "string" } }, required: ["item_id"] } } },
  { type: "function", function: { name: "plaid_setItemLoginRequired", description: "Set ITEM_LOGIN_REQUIRED (Sandbox)", parameters: { type: "object", properties: { item_id: { type: "string" } }, required: ["item_id"] } } },
  { type: "function", function: { name: "app_exchangePublicToken", description: "Exchange public_token", parameters: { type: "object", properties: { public_token: { type: "string" }, institution_name: { type: "string" } }, required: ["public_token"] } } },
  { type: "function", function: { name: "app_syncTransactions", description: "Sync transactions", parameters: { type: "object", properties: { item_id: { type: "string" } } } } },
  { type: "function", function: { name: "app_syncRecurring", description: "Sync recurring streams", parameters: { type: "object", properties: { item_id: { type: "string" } } } } },
  { type: "function", function: { name: "app_getInstitutions", description: "Get linked institutions", parameters: { type: "object", properties: {} } } },
  { type: "function", function: { name: "app_getPods", description: "Get pods", parameters: { type: "object", properties: {} } } },
  { type: "function", function: { name: "app_getRoundups", description: "Get roundups", parameters: { type: "object", properties: {} } } },
  { type: "function", function: { name: "app_postRoundups", description: "Post roundups (approval)", parameters: { type: "object", properties: { user_challenge_id: { type: "string" }, pod_id: { type: "string" }, amount_cents: { type: "number" }, idempotency_key: { type: "string" } }, required: ["user_challenge_id", "pod_id", "amount_cents", "idempotency_key"] } } },
  { type: "function", function: { name: "app_getRecurring", description: "Get recurring streams", parameters: { type: "object", properties: {} } } },
  { type: "function", function: { name: "app_recordSavings", description: "Record savings (approval)", parameters: { type: "object", properties: { pod_id: { type: "string" }, amount_cents: { type: "number" }, source: { type: "string" }, note: { type: "string" }, idempotency_key: { type: "string" } }, required: ["pod_id", "amount_cents", "source", "idempotency_key"] } } },
  { type: "function", function: { name: "app_getUserChallenges", description: "Get user challenges", parameters: { type: "object", properties: {} } } },
  { type: "function", function: { name: "app_startChallenge", description: "Start challenge (approval)", parameters: { type: "object", properties: { challengeKey: { type: "string" }, sinkPodId: { type: "string" }, idempotency_key: { type: "string" } }, required: ["challengeKey", "sinkPodId", "idempotency_key"] } } },
  { type: "function", function: { name: "app_updateChallenge", description: "Update challenge (approval)", parameters: { type: "object", properties: { id: { type: "string" }, status: { type: "string" }, sinkPodId: { type: "string" }, idempotency_key: { type: "string" } }, required: ["id", "idempotency_key"] } } },
]

export type ToolCallName = (typeof toolSchemas)[number]["function"]["name"]

export const toolImplMap: Record<string, (args: any) => Promise<any>> = {
  plaid_createPublicToken,
  plaid_fireTransactionsWebhook,
  plaid_setItemLoginRequired,
  app_exchangePublicToken,
  app_syncTransactions,
  app_syncRecurring,
  app_getInstitutions,
  app_getPods,
  app_getRoundups,
  app_postRoundups,
  app_getRecurring,
  app_recordSavings,
  app_getUserChallenges,
  app_startChallenge,
  app_updateChallenge,
}

