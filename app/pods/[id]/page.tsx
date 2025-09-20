"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { PodProgressRing } from "@/components/pods/pod-progress-ring"
import { InflowChip } from "@/components/pods/inflow-chip"
import { EventList } from "@/components/pods/event-list"
import { LoadingSkeleton } from "@/components/common/loading-skeleton"
import { usePod } from "@/lib/api"
import { formatCurrency, formatDate, calculateETA } from "@/lib/format"
import { ArrowLeft, Settings, Plus, Star } from "lucide-react"
import Link from "next/link"
import type { Inflow, Event, Challenge } from "@/types"

// Empty inflows data - will be populated from API
const mockInflows: Inflow[] = []

const mockEvents: Event[] = []

const mockConnectedChallenges: Challenge[] = []

export default function PodDetailPage() {
  const params = useParams()
  const podId = params.id as string
  const { data: pod, isLoading, error } = usePod(podId)
  const [isFeatured, setIsFeatured] = useState(false)

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSkeleton />
      </div>
    )
  }

  if (error || !pod) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <div className="text-destructive mb-2">Pod not found</div>
            <Button asChild>
              <Link href="/pods">Back to Pods</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const monthlyRate = 0 // Will be calculated from actual data
  const eta = calculateETA(pod.currentAmount, pod.targetAmount, monthlyRate)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/pods">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Pods
          </Link>
        </Button>
      </div>

      {/* Pod Overview */}
      <div className="grid gap-6 lg:grid-cols-3 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  {pod.name}
                  {pod.isFeatured && <Star className="h-5 w-5 text-warning fill-warning" />}
                </CardTitle>
                <div className="mt-2 space-y-1">
                  <div className="text-lg font-semibold">
                    {formatCurrency(pod.currentAmount)} of {formatCurrency(pod.targetAmount)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Target Date: {formatDate(pod.targetDate)} • ETA: {eta}
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <PodProgressRing current={pod.currentAmount} target={pod.targetAmount} size={120} strokeWidth={8} />
              <div className="flex-1 space-y-4">
                <div>
                  <Label htmlFor="featured" className="text-sm font-medium">
                    Featured Pod
                  </Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Switch id="featured" checked={isFeatured} onCheckedChange={setIsFeatured} />
                    <span className="text-sm text-muted-foreground">Show progress on public profile</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Active Inflows</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockInflows.map((inflow, index) => (
                <div key={index} className="flex items-center justify-between">
                  <InflowChip inflow={inflow} />
                  <div className="text-xs text-muted-foreground">
                    {inflow.lastContribution && formatDate(inflow.lastContribution)}
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full mt-4 bg-transparent">
                <Plus className="h-4 w-4 mr-2" />
                Connect Challenge
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="challenges">Connected Challenges</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Manual Deposit
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  Export History
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  Share Progress
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Monthly Average</span>
                  <span className="font-medium">{formatCurrency(monthlyRate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Days Active</span>
                  <span className="font-medium">0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Deposits</span>
                  <span className="font-medium">0</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="events">
          <EventList events={mockEvents} />
        </TabsContent>

        <TabsContent value="challenges">
          <div className="space-y-4">
            {mockConnectedChallenges.map((challenge) => (
              <Card key={challenge.id}>
                <CardContent className="flex items-center justify-between p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <div className="h-5 w-5 bg-primary rounded" />
                    </div>
                    <div>
                      <div className="font-medium">{challenge.name}</div>
                      <div className="text-sm text-muted-foreground">{challenge.description}</div>
                      <Badge variant="outline" className="mt-1">
                        {challenge.expectedImpact}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Active</Badge>
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
