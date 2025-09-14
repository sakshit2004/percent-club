import { NextResponse } from "next/server"
import { createClient as createSbServer } from "@/lib/supabase/server"

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const sb = await createSbServer()
  const {
    data: { user },
  } = await sb.auth.getUser()
  if (!user) return new NextResponse("Unauthorized", { status: 401 })

  const { data, error } = await sb
    .from("pods")
    .select("id, name, target_amount, current_amount, target_date, featured_public")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .maybeSingle()

  if (error) return new NextResponse(error.message, { status: 500 })
  if (!data) return new NextResponse("Not found", { status: 404 })

  const pod = {
    id: data.id as string,
    name: data.name as string,
    targetAmount: Number((data as any).target_amount || 0),
    currentAmount: Number((data as any).current_amount || 0),
    targetDate: (data as any).target_date || "",
    isFeatured: !!(data as any).featured_public,
  }

  return NextResponse.json(pod)
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const sb = await createSbServer()
  const {
    data: { user },
  } = await sb.auth.getUser()
  if (!user) return new NextResponse("Unauthorized", { status: 401 })

  const body = await request.json().catch(() => ({}))
  const updates: any = {}
  if (typeof body.name === "string") updates.name = body.name
  if (typeof body.targetAmount === "number") updates.target_amount = body.targetAmount
  if (typeof body.targetDate === "string") updates.target_date = body.targetDate || null
  if (typeof body.isFeatured === "boolean") updates.featured_public = body.isFeatured

  const { error } = await sb
    .from("pods")
    .update(updates)
    .eq("id", params.id)
    .eq("user_id", user.id)

  if (error) return new NextResponse(error.message, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const sb = await createSbServer()
  const {
    data: { user },
  } = await sb.auth.getUser()
  if (!user) return new NextResponse("Unauthorized", { status: 401 })

  const { error } = await sb
    .from("pods")
    .delete()
    .eq("id", params.id)
    .eq("user_id", user.id)

  if (error) return new NextResponse(error.message, { status: 500 })
  return NextResponse.json({ ok: true })
}


