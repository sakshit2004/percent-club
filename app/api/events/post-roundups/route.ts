import { NextResponse } from "next/server";
import { createClient as createSbServer } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const sb = await createSbServer();
    const {
      data: { user },
    } = await sb.auth.getUser();
    if (!user) return new NextResponse("Unauthorized", { status: 401 });

    const body = await request.json().catch(() => ({} as any));
    const { user_challenge_id, pod_id, amount_cents, idempotency_key } = body || {};
    if (!user_challenge_id || !pod_id || !amount_cents) return new NextResponse("Missing fields", { status: 400 });

    // Idempotency via lookup of existing event by key embedded in note
    const noteKey = idempotency_key ? `idemp:${idempotency_key}` : undefined;
    if (noteKey) {
      const { data: existing, error: exErr } = await sb
        .from("challenge_events")
        .select("id")
        .eq("user_id", user.id)
        .eq("pod_id", pod_id)
        .eq("source", "round_ups")
        .ilike("note", `%${noteKey}%`)
        .limit(1)
        .maybeSingle();
      if (exErr) throw exErr;
      if (existing) return NextResponse.json({ ok: true, details: { deduped: true } });
    }

    // Decrement roundup_state.pending_cents if present
    await sb.rpc("ensure_roundup_state", { p_user_challenge_id: user_challenge_id }).catch(() => undefined);
    await sb.rpc("increment_roundup_pending", { p_user_challenge_id: user_challenge_id, p_delta: -Math.abs(amount_cents) }).catch(() => undefined);

    // Record event
    const { error } = await sb.from("challenge_events").insert({
      user_id: user.id,
      pod_id,
      source: "round_ups",
      amount_cents: Math.abs(amount_cents),
      status: "posted",
      verification_source: "lonniee",
      note: noteKey || null,
    });
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return new NextResponse(e?.message || "Failed to post round-ups", { status: 500 });
  }
}


