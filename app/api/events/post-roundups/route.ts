import { NextRequest, NextResponse } from "next/server"
import { createClient as createSbServer } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  const sb = await createSbServer()
  const {
    data: { user },
  } = await sb.auth.getUser()
  if (!user) return new NextResponse("Unauthorized", { status: 401 })

  const body = await req.json().catch(() => ({}))
  const user_challenge_id: string | undefined = body?.user_challenge_id
  const pod_id: string | undefined = body?.pod_id
  const amount_cents: number = Number(body?.amount_cents || 0)
  const idempotency_key: string | undefined = body?.idempotency_key
  if (!user_challenge_id || !pod_id || !amount_cents || !idempotency_key) {
    return new NextResponse("Missing fields", { status: 400 })
  }

  // Idempotency check: unique constraint on (user_id, idempotency_key)
  const { data: existing } = await sb
    .from("challenge_events")
    .select("id")
    .eq("user_id", user.id)
    .eq("idempotency_key", idempotency_key)
    .maybeSingle()
  if (existing?.id) return NextResponse.json({ ok: true, details: { idempotent: true } })

  // Insert event row
  const { error } = await sb.from("challenge_events").insert({
    user_id: user.id,
    source: "roundups_post",
    user_challenge_id,
    pod_id,
    amount_cents,
    status: "posted",
    verification_source: "user_approved",
    idempotency_key,
  })
  if (error) return new NextResponse(error.message, { status: 500 })

  return NextResponse.json({ ok: true, details: { amount_cents, pod_id } })
}

