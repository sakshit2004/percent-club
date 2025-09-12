import { NextResponse } from "next/server"
import { getPlaidClient, isMockMode } from "@/lib/plaid"
import { createClient as createSbServer } from "@/lib/supabase/server"

export async function POST() {
  try {
    const sb = await createSbServer()
    const {
      data: { user },
      error,
    } = await sb.auth.getUser()
    if (error || !user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    if (isMockMode()) {
      return NextResponse.json({ link_token: "mock-link-token" })
    }

    const plaid = getPlaidClient()
    const res = await plaid.linkTokenCreate({
      user: { client_user_id: user.id },
      client_name: "Percent Club",
      products: ["transactions"],
      country_codes: ["US"],
      language: "en",
    })
    return NextResponse.json({ link_token: res.data.link_token })
  } catch (e: any) {
    return new NextResponse(e?.message || "Failed to create link token", { status: 500 })
  }
}


