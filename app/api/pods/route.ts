import { NextResponse } from "next/server"
import { createClient as createSbServer } from "@/lib/supabase/server"

export async function GET() {
  try {
    const sb = await createSbServer()
    const {
      data: { user },
    } = await sb.auth.getUser()
    if (!user) return new NextResponse("Unauthorized", { status: 401 })

    const { data, error } = await sb
      .from("pods")
      .select("id, name, target_amount, current_amount, target_date, featured_public")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) throw error

    const pods = (data || []).map((p) => ({
      id: p.id as string,
      name: p.name as string,
      targetAmount: Number((p as any).target_amount || 0),
      currentAmount: Number((p as any).current_amount || 0),
      targetDate: (p as any).target_date || "",
      isFeatured: !!(p as any).featured_public,
      percentToGoal: (p as any).target_amount ? (Number((p as any).current_amount || 0) / Number((p as any).target_amount || 0)) * 100 : null,
      lastActivityLabel: null,
      inflows: { roundups: 0, autosave: 0, cashback: 0 },
    }))

    return NextResponse.json({ pods })
  } catch (e: any) {
    console.error("/api/pods GET failed:", e)
    return NextResponse.json({ pods: [], error: e?.message || "unknown" }, { status: 200 })
  }
}

export async function POST(request: Request) {
  try {
    const sb = await createSbServer()
    const {
      data: { user },
    } = await sb.auth.getUser()
    if (!user) return new NextResponse("Unauthorized", { status: 401 })

    const body = await request.json().catch(() => ({}))
    const name: string | undefined = body?.name
    const targetAmount: number = Number(body?.targetAmount || 0)
    const targetDate: string | undefined = body?.targetDate
    const isFeatured: boolean = !!body?.isFeatured
    if (!name) return new NextResponse("Missing name", { status: 400 })

    const { data, error } = await sb
      .from("pods")
      .insert({
        user_id: user.id,
        name,
        target_amount: targetAmount || 0,
        current_amount: 0,
        target_date: targetDate ? targetDate : null,
        featured_public: isFeatured,
      })
      .select("id")
      .maybeSingle()

    if (error) throw error
    return NextResponse.json({ id: data?.id })
  } catch (e: any) {
    console.error("/api/pods POST failed:", e)
    return new NextResponse(e?.message || "failed", { status: 500 })
  }
}


