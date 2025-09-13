import { NextResponse } from "next/server"
import { createClient as createSbServer } from "@/lib/supabase/server"

export async function GET() {
  const sb = await createSbServer()
  const {
    data: { user },
  } = await sb.auth.getUser()
  if (!user) return new NextResponse("Unauthorized", { status: 401 })

  // Count items
  const { data: items, error: itemsErr } = await sb
    .from("plaid_items")
    .select("item_id")
    .eq("user_id", user.id)

  if (itemsErr) return new NextResponse(itemsErr.message, { status: 500 })
  const itemIds = (items || []).map((i: any) => i.item_id)

  let accountsCount = 0
  if (itemIds.length > 0) {
    const { count, error: accErr } = await sb
      .from("plaid_accounts")
      .select("id", { count: "exact", head: true })
      .in("item_id", itemIds)
    if (accErr) return new NextResponse(accErr.message, { status: 500 })
    accountsCount = count || 0
  }

  return NextResponse.json({ items: itemIds.length, accounts: accountsCount })
}


