import { NextResponse } from "next/server"
import { createClient as createSbServer } from "@/lib/supabase/server"

export async function GET() {
  const sb = await createSbServer()
  const {
    data: { user },
  } = await sb.auth.getUser()
  if (!user) return new NextResponse("Unauthorized", { status: 401 })

  // Compute pending roundups from last 30 days of posted spend txns
  const { data: txns, error } = await sb
    .from("transactions")
    .select("amount_cents, pending")
    .eq("user_id", user.id)
    .order("date", { ascending: false })
    .limit(500)
  if (error) return new NextResponse(error.message, { status: 500 })

  let pending_cents = 0
  for (const t of txns || []) {
    if (!t.pending && (t as any).amount_cents > 0) {
      const remainder = (t as any).amount_cents % 100
      if (remainder > 0) pending_cents += 100 - remainder
    }
  }

  return NextResponse.json({
    pending_cents,
    last30: { round_ups: pending_cents / 100, autosave: 0, cashback: 0 },
  })
}


