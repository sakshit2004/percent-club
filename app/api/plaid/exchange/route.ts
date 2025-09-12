import { NextResponse } from "next/server"
import { getPlaidClient, isMockMode } from "@/lib/plaid"
import { createClient as createSbServer } from "@/lib/supabase/server"
import { encryptAesGcm } from "@/lib/crypto"

export async function POST(request: Request) {
  try {
    const sb = await createSbServer()
    const {
      data: { user },
    } = await sb.auth.getUser()
    if (!user) return new NextResponse("Unauthorized", { status: 401 })

    const body = await request.json().catch(() => ({}))
    const public_token: string | undefined = body?.public_token
    const institution_name: string | undefined = body?.institution_name
    if (!public_token && !isMockMode()) return new NextResponse("Missing public_token", { status: 400 })

    if (isMockMode()) {
      // Store a mock item so downstream flows work
      const enc = encryptAesGcm("mock-access-token")
      await sb.from("plaid_items").upsert({
        item_id: "mock-item",
        user_id: user.id,
        access_token_enc: enc,
        institution_name: institution_name || "Mock Bank",
        status: "ok",
      })
      return NextResponse.json({ ok: true, item_id: "mock-item" })
    }

    const plaid = getPlaidClient()
    const res = await plaid.itemPublicTokenExchange({ public_token })
    const accessToken = res.data.access_token
    const itemId = res.data.item_id
    const enc = encryptAesGcm(accessToken)

    const { error } = await sb.from("plaid_items").upsert({
      item_id: itemId,
      user_id: user.id,
      access_token_enc: enc,
      institution_name: institution_name || null,
      status: "ok",
    })
    if (error) throw error

    return NextResponse.json({ ok: true, item_id: itemId })
  } catch (e: any) {
    return new NextResponse(e?.message || "Failed to exchange token", { status: 500 })
  }
}


