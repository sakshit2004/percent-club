"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal, Award } from "lucide-react"
import type { LeaderboardEntry } from "@/types"
import Link from "next/link"

interface LeaderboardProps {
  entries: LeaderboardEntry[]
  title?: string
  type?: "progress" | "streak"
}

export function Leaderboard({ entries, title = "Leaderboard", type = "progress" }: LeaderboardProps) {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-4 w-4 text-warning" />
      case 2:
        return <Medal className="h-4 w-4 text-muted-foreground" />
      case 3:
        return <Award className="h-4 w-4 text-warning/70" />
      default:
        return <span className="text-sm font-semibold text-muted-foreground">#{rank}</span>
    }
  }

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-warning/10 text-warning border-warning/20"
      case 2:
        return "bg-muted/50 text-muted-foreground border-muted"
      case 3:
        return "bg-warning/5 text-warning/70 border-warning/10"
      default:
        return "bg-muted/20 text-muted-foreground border-muted/30"
    }
  }

  if (entries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No entries yet</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {entries.map((entry) => (
            <div
              key={entry.handle}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <Badge variant="outline" className={`gap-1 ${getRankBadgeColor(entry.rank)}`}>
                {getRankIcon(entry.rank)}
              </Badge>

              <Link href={`/profile/${entry.handle}`} className="flex items-center gap-3 flex-1 hover:underline">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={entry.avatar || "/placeholder.svg"} alt={entry.alias} />
                  <AvatarFallback className="text-xs">{entry.alias.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="font-medium">{entry.alias}</div>
                  <div className="text-sm text-muted-foreground">@{entry.handle}</div>
                </div>
              </Link>

              <div className="text-right">
                <div className="font-semibold">
                  {type === "progress" ? `${entry.progress}%` : `${entry.streak} days`}
                </div>
                <div className="text-xs text-muted-foreground">{type === "progress" ? "progress" : "streak"}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
