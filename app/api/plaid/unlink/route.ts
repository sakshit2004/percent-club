import { NextResponse } from "next/server"
import { createClient as createSbServer } from "@/lib/supabase/server"
import { getSupabaseAdmin } from "@/lib/supabaseAdmin"

export async function POST() {
  try {
    const sb = await createSbServer()
    const {
      data: { user },
    } = await sb.auth.getUser()
    if (!user) return new NextResponse("Unauthorized", { status: 401 })

    const admin = getSupabaseAdmin()
    const { error } = await admin.from("plaid_items").delete().eq("user_id", user.id)
    if (error) throw error

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return new NextResponse(e?.message || "unlink failed", { status: 500 })
  }
}


