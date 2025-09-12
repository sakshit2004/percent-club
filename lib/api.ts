export type InstitutionsRes = {
  items: {
    item_id: string
    institution_name: string
    status: "ok" | "needs_relink" | "error"
    last_synced_at: string | null
  }[]
}

export type RoundupsRes = {
  pending_cents: number
  last30: { round_ups: number; autosave: number; cashback: number }
}

export type RecurringRow = {
  id?: string
  merchant: string
  monthly_cost_cents: number
  next_date: string | null
  flags: string[]
  status: "active" | "canceled" | "rescheduled"
  reasons: string[]
}

export type RecurringRes = { rows: RecurringRow[]; potential_savings_cents: number }

export type PodsRes = {
  pods: {
    id: string
    name: string
    percentToGoal: number | null
    lastActivityLabel: string | null
    inflows: { roundups: number; autosave: number; cashback: number }
  }[]
}

async function apiFetch<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    cache: "no-store",
  })
  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(text || `Request failed: ${res.status}`)
  }
  return (await res.json()) as T
}

export async function getInstitutions(): Promise<InstitutionsRes> {
  return apiFetch<InstitutionsRes>("/api/plaid/institutions")
}

export async function postLinkToken(body?: any): Promise<{ link_token: string }> {
  return apiFetch<{ link_token: string }>("/api/plaid/link-token", {
    method: "POST",
    body: JSON.stringify(body || {}),
  })
}

export async function postExchange(body: { public_token: string; institution_name?: string }): Promise<any> {
  return apiFetch<any>("/api/plaid/exchange", {
    method: "POST",
    body: JSON.stringify(body),
  })
}

export async function postSyncTx(item_id?: string): Promise<{ synced: number }> {
  const url = "/api/sync/transactions" + (item_id ? `?item_id=${encodeURIComponent(item_id)}` : "")
  return apiFetch<{ synced: number }>(url, { method: "POST" })
}

export async function postSyncRecurring(item_id?: string): Promise<{ refreshed: boolean }> {
  const url = "/api/sync/recurring" + (item_id ? `?item_id=${encodeURIComponent(item_id)}` : "")
  return apiFetch<{ refreshed: boolean }>(url, { method: "POST" })
}

export async function getRoundups(): Promise<RoundupsRes> {
  return apiFetch<RoundupsRes>("/api/data/roundups")
}

export async function getRecurring(): Promise<RecurringRes> {
  return apiFetch<RecurringRes>("/api/data/recurring")
}

export async function getPods(): Promise<PodsRes> {
  return apiFetch<PodsRes>("/api/pods")
}

export async function postPostRoundups(body: {
  user_challenge_id: string
  pod_id: string
  amount_cents: number
}): Promise<{ ok: true }> {
  return apiFetch<{ ok: true }>("/api/events/post-roundups", {
    method: "POST",
    body: JSON.stringify(body),
  })
}

export async function postRecordSavings(body: {
  pod_id: string
  amount_cents: number
  source: string
  note?: string
}): Promise<{ ok: true }> {
  return apiFetch<{ ok: true }>("/api/events/record-savings", {
    method: "POST",
    body: JSON.stringify(body),
  })
}

export async function getChallenges(): Promise<any> {
  return apiFetch<any>("/api/challenges")
}

export async function getUserChallenges(): Promise<any> {
  return apiFetch<any>("/api/user-challenges")
}

export async function patchUserChallenge(
  id: string,
  body: { status?: "on" | "paused"; sinkPodId?: string },
): Promise<any> {
  return apiFetch<any>(`/api/user-challenges/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  })
}

export async function postUserChallenge(body: { challengeKey: string; sinkPodId: string }): Promise<any> {
  return apiFetch<any>("/api/user-challenges", {
    method: "POST",
    body: JSON.stringify(body),
  })
}
