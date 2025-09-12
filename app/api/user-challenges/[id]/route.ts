import { NextResponse } from "next/server"
import { createClient as createSbServer } from "@/lib/supabase/server"

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const sb = await createSbServer()
  const {
    data: { user },
  } = await sb.auth.getUser()
  if (!user) return new NextResponse("Unauthorized", { status: 401 })

  const body = await request.json().catch(() => ({}))
  const updates: any = {}
  if (typeof body.status === "string") updates.status = body.status
  if (typeof body.sinkPodId === "string") updates.sink_pod_id = body.sinkPodId

  const { error } = await sb
    .from("user_challenges")
    .update(updates)
    .eq("id", params.id)
    .eq("user_id", user.id)

  if (error) return new NextResponse(error.message, { status: 500 })
  return NextResponse.json({ ok: true })
}


