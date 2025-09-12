import { NextResponse } from "next/server"
import { getPlaidClient, isMockMode } from "@/lib/plaid"

export async function GET() {
  try {
    if (isMockMode()) {
      return NextResponse.json({ items: [] })
    }
    const plaid = getPlaidClient()
    const res = await plaid.institutionsGet({ country_codes: ["US"], count: 50, offset: 0 })
    const items = res.data.institutions.map((i) => ({
      item_id: i.institution_id,
      institution_name: i.name,
      status: "ok" as const,
      last_synced_at: null,
    }))
    return NextResponse.json({ items })
  } catch (e: any) {
    return new NextResponse(e?.message || "Failed to fetch institutions", { status: 500 })
  }
}


