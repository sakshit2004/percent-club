import { NextResponse } from "next/server"
import { createClient as createSbServer } from "@/lib/supabase/server"
import { getSupabaseAdmin } from "@/lib/supabaseAdmin"
import { getPlaidClient, isMockMode } from "@/lib/plaid"
import { decryptAesGcm } from "@/lib/crypto"

export async function POST() {
  try {
    const sb = await createSbServer()
    const {
      data: { user },
    } = await sb.auth.getUser()
    if (!user) return new NextResponse("Unauthorized", { status: 401 })

    // Use admin client for DB writes to bypass RLS on insert
    const admin = getSupabaseAdmin()

    // Load user's items
    const { data: items, error: itemsErr } = await admin
      .from("plaid_items")
      .select("item_id, access_token_enc")
      .eq("user_id", user.id)
    if (itemsErr) throw itemsErr
    if (!items || items.length === 0) return NextResponse.json({ synced: 0 })

    let total = 0
    for (const it of items) {
      const accessToken = isMockMode() ? "mock-access-token" : decryptAesGcm(it.access_token_enc as string)
      const plaid = getPlaidClient()

      // Pull last 30 days
      const end = new Date()
      const start = new Date()
      start.setDate(end.getDate() - 30)
      const res = await plaid.transactionsGet({
        access_token: accessToken,
        start_date: start.toISOString().slice(0, 10),
        end_date: end.toISOString().slice(0, 10),
        options: { count: 250 },
      })

      const txs = res.data.transactions || []
      total += txs.length
      const rows = txs.map((t) => ({
        user_id: user.id,
        item_id: it.item_id,
        account_id: t.account_id,
        plaid_tx_id: t.transaction_id,
        date: t.date,
        name: t.name,
        merchant_name: (t.merchant_name as any) || null,
        amount_cents: Math.round(Math.abs(t.amount || 0) * 100),
        pending: !!t.pending,
        category: (t.category as any) || null,
      }))

      // Upsert
      const { error: upErr } = await admin.from("transactions").upsert(rows, { onConflict: "plaid_tx_id" })
      if (upErr) throw upErr

      // mark item as synced
      await admin.from("plaid_items").update({ last_synced_at: new Date().toISOString() }).eq("item_id", it.item_id)
    }

    return NextResponse.json({ synced: total })
  } catch (e: any) {
    return new NextResponse(e?.message || "sync failed", { status: 500 })
  }
}


