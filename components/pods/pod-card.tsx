"use client"

import { Card, CardContent, CardHeader, CardTitle, CardAction } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PodProgressRing } from "./pod-progress-ring"
import { InflowChip } from "./inflow-chip"
import { formatCurrency, calculateETA } from "@/lib/format"
import type { Pod, Inflow } from "@/types"
import { Eye, Star } from "lucide-react"
import Link from "next/link"

interface PodCardProps {
  pod: Pod
  inflows?: Inflow[]
  onToggleFeatured?: (podId: string) => void
}

export function PodCard({ pod, inflows = [], onToggleFeatured }: PodCardProps) {
  const progress = pod.currentAmount / pod.targetAmount
  const monthlyRate = 150 // Mock monthly rate - would be calculated from inflows
  const eta = calculateETA(pod.currentAmount, pod.targetAmount, monthlyRate)

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              {pod.name}
              {pod.isFeatured && <Star className="h-4 w-4 text-warning fill-warning" />}
            </CardTitle>
            <div className="mt-2 space-y-1">
              <div className="text-sm text-muted-foreground">
                {formatCurrency(pod.currentAmount)} of {formatCurrency(pod.targetAmount)}
              </div>
              <div className="text-xs text-muted-foreground">ETA: {eta}</div>
            </div>
          </div>
          <PodProgressRing current={pod.currentAmount} target={pod.targetAmount} size={64} strokeWidth={6} />
        </div>
      </CardHeader>

      {inflows.length > 0 && (
        <CardContent>
          <div className="space-y-3">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Active Inflows</div>
            <div className="flex flex-wrap gap-2">
              {inflows.map((inflow, index) => (
                <InflowChip key={index} inflow={inflow} />
              ))}
            </div>
          </div>
        </CardContent>
      )}

      <CardAction>
        <div className="flex flex-col gap-2">
          <Button size="sm" variant="outline" asChild>
            <Link href={`/pods/${pod.id}`}>
              <Eye className="h-4 w-4" />
              View
            </Link>
          </Button>
          {onToggleFeatured && (
            <Button size="sm" variant="ghost" onClick={() => onToggleFeatured(pod.id)}>
              <Star className={`h-4 w-4 ${pod.isFeatured ? "fill-warning text-warning" : ""}`} />
            </Button>
          )}
        </div>
      </CardAction>
    </Card>
  )
}
