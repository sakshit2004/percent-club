import { NextRequest, NextResponse } from "next/server"
import { createClient as createSbServer } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  const sb = await createSbServer()
  const {
    data: { user },
  } = await sb.auth.getUser()
  if (!user) return new NextResponse("Unauthorized", { status: 401 })

  const body = await req.json().catch(() => ({}))
  const pod_id: string | undefined = body?.pod_id
  const amount_cents: number = Number(body?.amount_cents || 0)
  const source: string | undefined = body?.source
  const note: string | undefined = body?.note
  const idempotency_key: string | undefined = body?.idempotency_key
  if (!pod_id || !amount_cents || !source || !idempotency_key) return new NextResponse("Missing fields", { status: 400 })

  const { data: existing } = await sb
    .from("challenge_events")
    .select("id")
    .eq("user_id", user.id)
    .eq("idempotency_key", idempotency_key)
    .maybeSingle()
  if (existing?.id) return NextResponse.json({ ok: true, details: { idempotent: true } })

  const { error } = await sb.from("challenge_events").insert({
    user_id: user.id,
    source,
    pod_id,
    amount_cents,
    note: note || null,
    status: "posted",
    verification_source: "user_approved",
    idempotency_key,
  })
  if (error) return new NextResponse(error.message, { status: 500 })
  return NextResponse.json({ ok: true, details: { amount_cents, pod_id, source } })
}

