import { NextResponse } from "next/server"
import { createClient as createSbServer } from "@/lib/supabase/server"

export async function GET() {
  const sb = await createSbServer()
  const {
    data: { user },
  } = await sb.auth.getUser()
  if (!user) return new NextResponse("Unauthorized", { status: 401 })

  const { data, error } = await sb
    .from("user_challenges")
    .select("id, challenge_key, sink_pod_id, status")
    .eq("user_id", user.id)

  if (error) return new NextResponse(error.message, { status: 500 })
  return NextResponse.json({ rows: data || [] })
}

export async function POST(request: Request) {
  const sb = await createSbServer()
  const {
    data: { user },
  } = await sb.auth.getUser()
  if (!user) return new NextResponse("Unauthorized", { status: 401 })

  const body = await request.json().catch(() => ({}))
  const challengeKey: string | undefined = body?.challengeKey
  const sinkPodId: string | undefined = body?.sinkPodId
  if (!challengeKey || !sinkPodId) return new NextResponse("Missing fields", { status: 400 })

  const { data, error } = await sb
    .from("user_challenges")
    .upsert({
      user_id: user.id,
      challenge_key: challengeKey,
      sink_pod_id: sinkPodId,
      status: "on",
    }, { onConflict: "user_id,challenge_key" })
    .select("id")
    .maybeSingle()

  if (error) return new NextResponse(error.message, { status: 500 })
  return NextResponse.json({ id: data?.id })
}


