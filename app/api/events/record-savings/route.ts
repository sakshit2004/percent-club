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
    const { pod_id, amount_cents, source, note, idempotency_key } = body || {};
    if (!pod_id || !amount_cents || !source) return new NextResponse("Missing fields", { status: 400 });

    const noteKey = idempotency_key ? `idemp:${idempotency_key}` : undefined;
    if (noteKey) {
      const { data: existing, error: exErr } = await sb
        .from("challenge_events")
        .select("id")
        .eq("user_id", user.id)
        .eq("pod_id", pod_id)
        .eq("source", source)
        .ilike("note", `%${noteKey}%`)
        .limit(1)
        .maybeSingle();
      if (exErr) throw exErr;
      if (existing) return NextResponse.json({ ok: true, details: { deduped: true } });
    }

    const { error } = await sb.from("challenge_events").insert({
      user_id: user.id,
      pod_id,
      source,
      amount_cents: Math.abs(amount_cents),
      status: "posted",
      verification_source: "lonniee",
      note: noteKey || null,
    });
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return new NextResponse(e?.message || "Failed to record savings", { status: 500 });
  }
}


