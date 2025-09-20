"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Target, Zap, Star, Calendar, Coins } from "lucide-react"

interface BadgeGridProps {
  badges: string[]
}

const badgeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "first-pod": Target,
  "streak-7": Calendar,
  "streak-30": Calendar,
  "saver-100": Coins,
  "saver-1000": Coins,
  challenger: Zap,
  "social-butterfly": Star,
  "goal-crusher": Trophy,
}

const badgeLabels: Record<string, string> = {
  "first-pod": "First Pod",
  "streak-7": "7-Day Streak",
  "streak-30": "30-Day Streak",
  "saver-100": "Small Saver",
  "saver-1000": "Big Saver",
  challenger: "Challenge Master",
  "social-butterfly": "Social Butterfly",
  "goal-crusher": "Goal Crusher",
}

const badgeColors: Record<string, string> = {
  "first-pod": "bg-primary/10 text-primary border-primary/20",
  "streak-7": "bg-success/10 text-success border-success/20",
  "streak-30": "bg-warning/10 text-warning border-warning/20",
  "saver-100": "bg-info/10 text-info border-info/20",
  "saver-1000": "bg-primary/10 text-primary border-primary/20",
  challenger: "bg-success/10 text-success border-success/20",
  "social-butterfly": "bg-warning/10 text-warning border-warning/20",
  "goal-crusher": "bg-destructive/10 text-destructive border-destructive/20",
}

export function BadgeGrid({ badges }: BadgeGridProps) {
  if (badges.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Badges</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No badges earned yet</p>
            <p className="text-sm text-muted-foreground mt-1">Complete challenges and reach goals to earn badges!</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Badges ({badges.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {badges.map((badgeId) => {
            const Icon = badgeIcons[badgeId] || Trophy
            const label = badgeLabels[badgeId] || badgeId
            const colorClass = badgeColors[badgeId] || "bg-muted/50"

            return (
              <div key={badgeId} className="flex flex-col items-center gap-2 p-3 rounded-lg bg-muted/20">
                <div className={`p-2 rounded-lg ${colorClass}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-medium text-center">{label}</span>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
