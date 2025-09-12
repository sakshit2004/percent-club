import { NextResponse } from "next/server"
import { createClient as createSbServer } from "@/lib/supabase/server"

type ChallengeDef = {
  id: string
  name: string
  description: string
  subtitle: string
  icon: string
  expectedImpact: string
}

const DEFINITIONS: ChallengeDef[] = [
  {
    id: "roundups",
    name: "Round-Ups",
    description: "Round purchases to the next dollar and save the difference.",
    subtitle: "Automatically skim your card spends",
    icon: "coins",
    expectedImpact: "$10–30 / 30d",
  },
  {
    id: "weekly-auto",
    name: "Weekly Auto-Save",
    description: "Save a fixed amount every week.",
    subtitle: "Set and forget",
    icon: "calendar",
    expectedImpact: "$20–200 / mo",
  },
  {
    id: "52-week",
    name: "52-Week",
    description: "Increase your savings each week for 52 weeks.",
    subtitle: "Classic ramp-up plan",
    icon: "trophy",
    expectedImpact: "$1.3k / year",
  },
  {
    id: "cashback",
    name: "Cashback Hunt",
    description: "Capture merchant offers and log them as saved.",
    subtitle: "Turn deals into savings",
    icon: "credit-card",
    expectedImpact: "$5–50 / mo",
  },
]

export async function GET() {
  const sb = await createSbServer()
  const {
    data: { user },
  } = await sb.auth.getUser()
  if (!user) return new NextResponse("Unauthorized", { status: 401 })

  const { data: bindings, error } = await sb
    .from("user_challenges")
    .select("challenge_key, sink_pod_id, status")
    .eq("user_id", user.id)

  if (error) return new NextResponse(error.message, { status: 500 })

  const sinkIds = (bindings || []).map((b) => b.sink_pod_id).filter(Boolean) as string[]
  let podNameById: Record<string, string> = {}
  if (sinkIds.length > 0) {
    const { data: pods } = await sb.from("pods").select("id, name").in("id", sinkIds)
    podNameById = Object.fromEntries((pods || []).map((p: any) => [p.id, p.name]))
  }

  const rows = DEFINITIONS.map((def) => {
    const bind = (bindings || []).find((b) => b.challenge_key === def.id)
    const sinkPodId = bind?.sink_pod_id || null
    return {
      id: def.id,
      name: def.name,
      description: def.description,
      subtitle: def.subtitle,
      icon: def.icon,
      expectedImpact: def.expectedImpact,
      isActive: bind?.status === "on",
      sinkPodId,
      sinkPodName: sinkPodId ? podNameById[sinkPodId] || null : null,
      config: {},
    }
  })

  return NextResponse.json({ challenges: rows })
}


