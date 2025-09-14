import { NextRequest } from "next/server";
import { createClient as createSbServer } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { getPlaidClient, isMockMode } from "@/lib/plaid";
import { decryptAesGcm } from "@/lib/crypto";

export async function POST(req: NextRequest) {
  try {
    const sb = await createSbServer();
    const {
      data: { user },
    } = await sb.auth.getUser();
    if (!user) return new Response("Unauthorized", { status: 401 });

    const admin = getSupabaseAdmin();
    const item_id = req.nextUrl.searchParams.get("item_id") || undefined;

    const { data: items, error: itemsErr } = await admin
      .from("plaid_items")
      .select("item_id, access_token_enc")
      .eq("user_id", user.id)
      .maybeSingle();

    if (itemsErr) throw itemsErr;
    if (!items) return Response.json({ synced: 0 });

    const accessToken = isMockMode() ? "mock-access-token" : decryptAesGcm((items as any).access_token_enc);
    const plaid = getPlaidClient();

    // Use Plaid recurring transactions beta if available; otherwise fallback to no-op
    try {
      // @ts-ignore: not typed in SDK yet for some versions
      const res = await (plaid as any).transactionsRecurringGet?.({ access_token: accessToken });
      const streams = res?.data?.streams || [];
      const rows = streams.map((s: any) => ({
        user_id: user.id,
        item_id: (items as any).item_id,
        stream_id: s.stream_id,
        merchant: s.merchant_name || s.description || null,
        cadence: s.cadence || null,
        next_date: s.next_date || null,
        average_amount_cents: Math.round(Math.abs(s.average_amount?.amount || 0) * 100),
        last_amount_cents: Math.round(Math.abs(s.last_amount?.amount || 0) * 100),
        category: s.category || null,
        status: "active",
      }));
      if (rows.length) {
        await admin.from("recurring_streams").upsert(rows, { onConflict: "stream_id" });
      }
    } catch {
      // ignore if endpoint not available
    }

    return Response.json({ synced: 1 });
  } catch (e: any) {
    return new Response(e?.message || "recurring sync failed", { status: 500 });
  }
}


