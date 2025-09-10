"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Coins, Calendar, CreditCard, Trophy, Settings } from "lucide-react"
import type { Challenge } from "@/types"

interface ChallengeCardProps {
  challenge: Challenge
  onStart?: (challengeId: string) => void
  onStop?: (challengeId: string) => void
  onConfigure?: (challengeId: string) => void
}

const challengeIcons = {
  roundups: Coins,
  "weekly-auto": Calendar,
  "52-week": Trophy,
  cashback: CreditCard,
}

export function ChallengeCard({ challenge, onStart, onStop, onConfigure }: ChallengeCardProps) {
  const IconComponent = challengeIcons[challenge.id as keyof typeof challengeIcons] || Coins

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <IconComponent className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              {challenge.name}
              {challenge.isActive && <Badge variant="secondary">Active</Badge>}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{challenge.subtitle}</p>
            <p className="text-sm text-muted-foreground mt-2">{challenge.description}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Expected Impact</span>
            <Badge variant="outline" className="bg-success/10 text-success border-success/20">
              {challenge.expectedImpact}
            </Badge>
          </div>

          {challenge.isActive && challenge.sinkPodName && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Connected to</span>
              <Badge variant="outline">{challenge.sinkPodName}</Badge>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <Switch
                checked={challenge.isActive}
                onCheckedChange={(checked) => {
                  if (checked && onStart) {
                    onStart(challenge.id)
                  } else if (!checked && onStop) {
                    onStop(challenge.id)
                  }
                }}
              />
              <span className="text-sm font-medium">{challenge.isActive ? "Active" : "Inactive"}</span>
            </div>

            {onConfigure && (
              <Button variant="outline" size="sm" onClick={() => onConfigure(challenge.id)}>
                <Settings className="h-4 w-4 mr-2" />
                Configure
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
