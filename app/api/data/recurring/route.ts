import { NextResponse } from "next/server"
import { createClient as createSbServer } from "@/lib/supabase/server"

export async function GET() {
  const sb = await createSbServer()
  const {
    data: { user },
  } = await sb.auth.getUser()
  if (!user) return new NextResponse("Unauthorized", { status: 401 })

  const { data, error } = await sb
    .from("recurring_streams")
    .select("id, merchant, average_amount_cents, next_date, status")
    .eq("user_id", user.id)
    .order("next_date", { ascending: true })
  if (error) return new NextResponse(error.message, { status: 500 })

  const rows = (data || []).map((r: any) => ({
    id: r.id,
    merchant: r.merchant || "",
    monthly_cost_cents: r.average_amount_cents || 0,
    next_date: r.next_date,
    flags: [] as string[],
    status: (r.status as any) || "active",
    reasons: [] as string[],
  }))
  const potential_savings_cents = rows.reduce((acc: number) => acc + Math.round((rows.length ? rows[0].monthly_cost_cents * 0.1 : 0)), 0)

  return NextResponse.json({ rows, potential_savings_cents })
}


