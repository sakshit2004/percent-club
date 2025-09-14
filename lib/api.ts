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
  const res = await apiFetch<any>("/api/pods")
  return Array.isArray(res) ? { pods: res } : (res as PodsRes)
}

export async function getPod(id: string): Promise<{
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  targetDate: string
  isFeatured: boolean
}> {
  return apiFetch(`/api/pods/${encodeURIComponent(id)}`)
}

// React Query hooks for Pods page
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export function usePods(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["pods"],
    queryFn: async () => (await getPods()).pods ?? ([] as any),
    ...(options || {}),
  })
}

export function usePod(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["pod", id],
    queryFn: () => getPod(id),
    enabled: !!id && (options?.enabled ?? true),
  })
}

export function useCreatePod() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (body: { name: string; targetAmount?: number; targetDate?: string; isFeatured?: boolean }) => {
      const res = await fetch("/api/pods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error(await res.text())
      return res.json()
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["pods"] }),
  })
}

export function useUpdatePod() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ podId, updates }: { podId: string; updates: { name?: string; targetAmount?: number; targetDate?: string; isFeatured?: boolean } }) => {
      const res = await fetch(`/api/pods/${encodeURIComponent(podId)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })
      if (!res.ok) throw new Error(await res.text())
      return res.json()
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["pods"] }),
  })
}

export function useDeletePod() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (podId: string) => {
      const res = await fetch(`/api/pods/${encodeURIComponent(podId)}`, { method: "DELETE" })
      if (!res.ok) throw new Error(await res.text())
      return res.json()
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["pods"] }),
  })
}

export function useExportPod() {
  // Stub for now; implement when export route exists
  return useMutation({
    mutationFn: async (_podId: string) => ({ ok: true }),
  })
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

// React Query hooks for Challenges (reuse same imports)

export function useChallenges() {
  return useQuery({ queryKey: ["challenges"], queryFn: async () => (await getChallenges()).challenges as any[] })
}

export function useToggleChallenge() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ challengeId, isActive, sinkPodId }: { challengeId: string; isActive: boolean; sinkPodId?: string }) => {
      if (sinkPodId) {
        return postUserChallenge({ challengeKey: challengeId, sinkPodId })
      }
      // Toggle on/off requires existing row id; refetch bindings to find it
      const res = await apiFetch<any>("/api/user-challenges")
      const row = (res.rows || []).find((r: any) => r.challenge_key === challengeId)
      if (!row) {
        if (!isActive) return { ok: true }
        throw new Error("Challenge not configured yet")
      }
      return apiFetch<any>(`/api/user-challenges/${encodeURIComponent(row.id)}`, {
        method: "PATCH",
        body: JSON.stringify({ status: isActive ? "on" : "paused" }),
      })
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["challenges"] })
    },
  })
}

export function useConfigureChallenge() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ challengeId, config }: { challengeId: string; config: Record<string, any> }) => {
      // For now, just ensure a binding exists; config persistence can be added later
      // by storing a JSONB column. We'll no-op here and refetch.
      const res = await apiFetch<any>("/api/user-challenges")
      const row = (res.rows || []).find((r: any) => r.challenge_key === challengeId)
      if (!row) return { ok: true }
      return { ok: true }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["challenges"] }),
  })
}
