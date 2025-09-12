import type { PostgrestSingleResponse } from "@supabase/supabase-js"
import { getSupabaseAdmin } from "@/lib/supabaseAdmin"

export interface NormalizedTxn {
  user_id: string
  amount_cents: number
  pending: boolean
  date: string
  name: string
}

function isSpend(txn: NormalizedTxn): boolean {
  // Positive amount_cents represents spend
  return txn.amount_cents > 0
}

function computeRoundupCents(amountCents: number): number {
  const remainder = amountCents % 100
  if (remainder === 0) return 0
  return 100 - remainder
}

export async function applyRoundupsFromTransactions(userId: string, txns: NormalizedTxn[]): Promise<{ added_cents: number }>
{
  const admin = getSupabaseAdmin()
  let added = 0
  // Load round_ups user_challenge
  const { data: challenge, error: chErr } = await admin
    .from("user_challenges")
    .select("id, status")
    .eq("user_id", userId)
    .eq("challenge_key", "round_ups")
    .maybeSingle()
  if (chErr) throw chErr

  const applicable = txns.filter((t) => !t.pending && isSpend(t))
  for (const t of applicable) {
    const ru = computeRoundupCents(t.amount_cents)
    added += ru
  }

  if (!challenge) {
    // No challenge yet; do not create state row. We keep it lazy by creating when user starts challenge.
    // Optionally, create an orphan state per spec; but we'll skip and compute on-demand.
    return { added_cents: added }
  }

  const { error: upErr } = await admin
    .from("roundup_state")
    .upsert({
      user_challenge_id: challenge.id,
      pending_cents: (undefined as any),
    }, { onConflict: "user_challenge_id" }) as unknown as PostgrestSingleResponse<any>

  if (upErr && (upErr as any).code !== "PGRST103") {
    // PGRST103 may indicate no body; we'll run an increment update next
  }

  const { error: incErr } = await admin
    .rpc("increment_roundup_pending", { p_user_challenge_id: challenge.id, p_delta: added })

  if (incErr) {
    // Fallback: manual update
    await admin.rpc("ensure_roundup_state", { p_user_challenge_id: challenge.id })
    await admin.rpc("increment_roundup_pending", { p_user_challenge_id: challenge.id, p_delta: added })
  }

  return { added_cents: added }
}

