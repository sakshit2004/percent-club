import { Badge } from "@/components/ui/badge"
import { Coins, Calendar, CreditCard, Plus } from "lucide-react"
import type { Inflow } from "@/types"

interface InflowChipProps {
  inflow: Inflow
}

const inflowIcons = {
  roundups: Coins,
  autosave: Calendar,
  cashback: CreditCard,
  manual: Plus,
}

const inflowColors = {
  roundups: "bg-primary/10 text-primary border-primary/20",
  autosave: "bg-success/10 text-success border-success/20",
  cashback: "bg-warning/10 text-warning border-warning/20",
  manual: "bg-info/10 text-info border-info/20",
}

export function InflowChip({ inflow }: InflowChipProps) {
  const Icon = inflowIcons[inflow.type]
  const colorClass = inflowColors[inflow.type]

  return (
    <Badge variant="outline" className={`gap-1.5 ${colorClass}`}>
      <Icon className="h-3 w-3" />
      <span className="text-xs font-medium">{inflow.amountLabel}</span>
    </Badge>
  )
}
