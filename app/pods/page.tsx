"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PodCard } from "@/components/pods/pod-card"
import { EmptyState } from "@/components/common/empty-state"
import { PodCardSkeleton } from "@/components/common/loading-skeleton"
import { usePods, useCreatePod } from "@/lib/api"
import { Plus, Target } from "lucide-react"
import type { Inflow } from "@/types"

// Mock inflows data
const mockInflows: Record<string, Inflow[]> = {
  "1": [
    { type: "roundups", amountLabel: "$12.50", lastContribution: "2024-01-15" },
    { type: "autosave", amountLabel: "$50.00", lastContribution: "2024-01-14" },
  ],
  "2": [{ type: "cashback", amountLabel: "$8.25", lastContribution: "2024-01-13" }],
}

export default function PodsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: pods, isLoading, error } = usePods()
  const createPodMutation = useCreatePod()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newPod, setNewPod] = useState({
    name: "",
    targetAmount: "",
    targetDate: "",
  })

  const handleCreatePod = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await createPodMutation.mutateAsync({
        name: newPod.name,
        targetAmount: Number.parseFloat(newPod.targetAmount),
        currentAmount: 0,
        targetDate: newPod.targetDate,
        isFeatured: false,
      })

      setIsCreateDialogOpen(false)
      setNewPod({ name: "", targetAmount: "", targetDate: "" })
    } catch (error) {
      console.error("Failed to create pod:", error)
    }
  }

  const handleToggleFeatured = (podId: string) => {
    // TODO: Implement toggle featured functionality
    console.log("Toggle featured for pod:", podId)
  }

  // If a `next` param is present (coming from the marketing header), route to it after landing on Pods
  useEffect(() => {
    const next = searchParams?.get("next")
    if (next && next.startsWith("/")) {
      // Use replace to avoid keeping the intermediary URL in history
      router.replace(next)
    }
  }, [router, searchParams])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Pods</h1>
            <p className="text-muted-foreground">Track your savings goals</p>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <PodCardSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <div className="text-destructive mb-2">Failed to load pods</div>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Pods</h1>
          <p className="text-muted-foreground">Track your savings goals</p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Pod
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Pod</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreatePod} className="space-y-4">
              <div>
                <Label htmlFor="name">Pod Name</Label>
                <Input
                  id="name"
                  value={newPod.name}
                  onChange={(e) => setNewPod({ ...newPod, name: e.target.value })}
                  placeholder="e.g., Emergency Fund"
                  required
                />
              </div>
              <div>
                <Label htmlFor="target">Target Amount</Label>
                <Input
                  id="target"
                  type="number"
                  value={newPod.targetAmount}
                  onChange={(e) => setNewPod({ ...newPod, targetAmount: e.target.value })}
                  placeholder="5000"
                  required
                />
              </div>
              <div>
                <Label htmlFor="date">Target Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={newPod.targetDate}
                  onChange={(e) => setNewPod({ ...newPod, targetDate: e.target.value })}
                  required
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={createPodMutation.isPending}>
                  {createPodMutation.isPending ? "Creating..." : "Create Pod"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {!pods || pods.length === 0 ? (
        <EmptyState
          icon={<Target className="h-12 w-12" />}
          title="No pods yet"
          description="Create your first savings pod to start tracking your goals and connecting challenges."
          action={{
            label: "Create Your First Pod",
            onClick: () => setIsCreateDialogOpen(true),
          }}
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pods.map((pod) => (
            <PodCard
              key={pod.id}
              pod={pod}
              inflows={mockInflows[pod.id] || []}
              onToggleFeatured={handleToggleFeatured}
            />
          ))}
        </div>
      )}
    </div>
  )
}
