"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface SuggestionCardProps {
  title: string
  description: string
  impactLabel: string
  actions: Array<{
    label: string
    variant: "primary" | "secondary"
    onClick: () => void
  }>
  type?: "success" | "warning" | "info"
}

export function SuggestionCard({ title, description, impactLabel, actions, type = "info" }: SuggestionCardProps) {
  const typeStyles = {
    success: "border-success/20 bg-success/5",
    warning: "border-warning/20 bg-warning/5",
    info: "border-info/20 bg-info/5",
  }

  const badgeStyles = {
    success: "bg-success/10 text-success border-success/20",
    warning: "bg-warning/10 text-warning border-warning/20",
    info: "bg-info/10 text-info border-info/20",
  }

  return (
    <Card className={typeStyles[type]}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-base">{title}</CardTitle>
          <Badge variant="outline" className={badgeStyles[type]}>
            {impactLabel}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        <div className="flex gap-2">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant === "primary" ? "default" : "outline"}
              size="sm"
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
