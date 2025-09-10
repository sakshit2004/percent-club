"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Event } from "@/types"
import { formatRelativeTime } from "@/lib/format"
import { ArrowUpRight, ArrowDownRight, TrendingUp, Zap } from "lucide-react"

interface EventListProps {
  events: Event[]
  showFilters?: boolean
}

const eventIcons = {
  deposit: ArrowUpRight,
  withdrawal: ArrowDownRight,
  interest: TrendingUp,
  challenge: Zap,
}

const eventColors = {
  deposit: "text-success",
  withdrawal: "text-destructive",
  interest: "text-info",
  challenge: "text-primary",
}

export function EventList({ events, showFilters = true }: EventListProps) {
  const [filter, setFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("date")

  const filteredEvents = events.filter((event) => {
    if (filter === "all") return true
    return event.type === filter
  })

  const sortedEvents = [...filteredEvents].sort((a, b) => {
    if (sortBy === "date") {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    }
    return 0
  })

  if (events.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <div className="text-muted-foreground mb-2">No transactions yet</div>
          <div className="text-sm text-muted-foreground text-center">
            Start a challenge or make a manual deposit to see your activity here.
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Transaction History</CardTitle>
          {showFilters && (
            <div className="flex gap-2">
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="deposit">Deposits</SelectItem>
                  <SelectItem value="withdrawal">Withdrawals</SelectItem>
                  <SelectItem value="interest">Interest</SelectItem>
                  <SelectItem value="challenge">Challenges</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedEvents.map((event) => {
            const Icon = eventIcons[event.type]
            const colorClass = eventColors[event.type]

            return (
              <div key={event.id} className="flex items-center justify-between py-3 border-b last:border-b-0">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-muted/50 ${colorClass}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-medium">{event.sourceDetail}</div>
                    <div className="text-sm text-muted-foreground">{formatRelativeTime(event.date)}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-semibold ${colorClass}`}>
                    {event.type === "withdrawal" ? "-" : "+"}
                    {event.amountLabel}
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {event.type}
                  </Badge>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
