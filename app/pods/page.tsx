"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PodCard } from "@/components/pods/pod-card"
import { EmptyState } from "@/components/common/empty-state"
import { PodCardSkeleton } from "@/components/common/loading-skeleton"
import { usePods, useCreatePod, useUpdatePod, useDeletePod, useExportPod } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Plus, Target, Eye, MoreHorizontal, Edit, Trash2, Download, Star, Info } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Inflow, Pod } from "@/types"

// Empty data structures - will be populated from API
const mockInflows: Record<string, Inflow[]> = {}
const mockRecentActivity: Record<string, string> = {}

export default function PodsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: pods, isLoading, error } = usePods()
  const createPodMutation = useCreatePod()
  const updatePodMutation = useUpdatePod()
  const deletePodMutation = useDeletePod()
  const exportPodMutation = useExportPod()
  const { toast } = useToast()

  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedPod, setSelectedPod] = useState<Pod | null>(null)

  // Form states
  const [newPod, setNewPod] = useState({
    name: "",
    targetAmount: "",
    targetDate: "",
    visibility: "private",
    isFeatured: false,
  })

  const [editPod, setEditPod] = useState({
    name: "",
    targetAmount: "",
    targetDate: "",
    visibility: "private",
    isFeatured: false,
  })

  const handleCreatePod = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await createPodMutation.mutateAsync({
        name: newPod.name,
        targetAmount: newPod.targetAmount ? Number.parseFloat(newPod.targetAmount) : 0,
        currentAmount: 0,
        targetDate: newPod.targetDate || "",
        isFeatured: newPod.isFeatured,
      })

      toast({
        title: "Pod created",
        description: `${newPod.name}`,
      })

      setIsCreateDialogOpen(false)
      setNewPod({ name: "", targetAmount: "", targetDate: "", visibility: "private", isFeatured: false })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create pod. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEditPod = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPod) return

    try {
      await updatePodMutation.mutateAsync({
        podId: selectedPod.id,
        updates: {
          name: editPod.name,
          targetAmount: editPod.targetAmount ? Number.parseFloat(editPod.targetAmount) : 0,
          targetDate: editPod.targetDate || "",
          isFeatured: editPod.isFeatured,
        },
      })

      toast({
        title: "Target updated",
        description: `${editPod.name} has been updated.`,
      })

      setIsEditDialogOpen(false)
      setSelectedPod(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update pod. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeletePod = async () => {
    if (!selectedPod) return

    try {
      await deletePodMutation.mutateAsync(selectedPod.id)
      toast({
        title: "Pod deleted",
        description: `${selectedPod.name} has been removed.`,
      })
      setIsDeleteDialogOpen(false)
      setSelectedPod(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete pod. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleExportPod = async (podId: string, podName: string) => {
    try {
      await exportPodMutation.mutateAsync(podId)
      toast({
        title: "Export started",
        description: `CSV export for ${podName} is being prepared.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export pod data. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleToggleFeatured = async (podId: string) => {
    const pod = pods?.find((p) => p.id === podId)
    if (!pod) return

    try {
      await updatePodMutation.mutateAsync({
        podId,
        updates: { isFeatured: !pod.isFeatured },
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update featured status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const openEditDialog = (pod: Pod) => {
    setSelectedPod(pod)
    setEditPod({
      name: pod.name,
      targetAmount: pod.targetAmount.toString(),
      targetDate: pod.targetDate,
      visibility: "private",
      isFeatured: pod.isFeatured,
    })
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (pod: Pod) => {
    setSelectedPod(pod)
    setIsDeleteDialogOpen(true)
  }

  const openViewDialog = (pod: Pod) => {
    setSelectedPod(pod)
    setIsViewDialogOpen(true)
  }

  // If a `next` param is present (coming from the marketing header), route to it after landing on Pods
  useEffect(() => {
    const next = searchParams?.get("next")
    if (next && next.startsWith("/")) {
      router.replace(next)
    }
  }, [router, searchParams])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Pods</h1>
            <p className="text-muted-foreground">Goal buckets that receive savings from Challenges & your Agent.</p>
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
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Pods</h1>
          <p className="text-muted-foreground">Goal buckets that receive savings from Challenges & your Agent.</p>
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
                <Label htmlFor="name">Pod Name *</Label>
                <Input
                  id="name"
                  value={newPod.name}
                  onChange={(e) => setNewPod({ ...newPod, name: e.target.value })}
                  placeholder="e.g., Education"
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
                  placeholder="15000"
                />
              </div>
              <div>
                <Label htmlFor="date">Target Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={newPod.targetDate}
                  onChange={(e) => setNewPod({ ...newPod, targetDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="visibility">Visibility</Label>
                <Select value={newPod.visibility} onValueChange={(value) => setNewPod({ ...newPod, visibility: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="private">Private</SelectItem>
                    <SelectItem value="public">Public</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={newPod.isFeatured}
                  onCheckedChange={(checked) => setNewPod({ ...newPod, isFeatured: checked })}
                />
                <Label htmlFor="featured">Feature % on profile</Label>
                <Info className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground">Public sees % only.</p>
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

      {/* Pods Grid */}
      {!pods || pods.length === 0 ? (
        <EmptyState
          icon={<Target className="h-12 w-12" />}
          title="Create your first pod"
          description="Name a goal, set a target, keep money in your bank."
          action={{
            label: "New Pod",
            onClick: () => setIsCreateDialogOpen(true),
          }}
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pods.map((pod) => (
            <EnhancedPodCard
              key={pod.id}
              pod={pod}
              inflows={mockInflows[pod.id] || []}
              recentActivity={mockRecentActivity[pod.id] || ""}
              onToggleFeatured={handleToggleFeatured}
              onEdit={openEditDialog}
              onDelete={openDeleteDialog}
              onView={openViewDialog}
              onExport={handleExportPod}
            />
          ))}
        </div>
      )}

      {/* Edit Pod Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Pod</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditPod} className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Pod Name *</Label>
              <Input
                id="edit-name"
                value={editPod.name}
                onChange={(e) => setEditPod({ ...editPod, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-target">Target Amount</Label>
              <Input
                id="edit-target"
                type="number"
                value={editPod.targetAmount}
                onChange={(e) => setEditPod({ ...editPod, targetAmount: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-date">Target Date</Label>
              <Input
                id="edit-date"
                type="date"
                value={editPod.targetDate}
                onChange={(e) => setEditPod({ ...editPod, targetDate: e.target.value })}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-featured"
                checked={editPod.isFeatured}
                onCheckedChange={(checked) => setEditPod({ ...editPod, isFeatured: checked })}
              />
              <Label htmlFor="edit-featured">Feature % on profile</Label>
            </div>
            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={updatePodMutation.isPending}>
                {updatePodMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Pod</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete "{selectedPod?.name}"? This action cannot be undone.
            </p>
            <div className="flex gap-2 pt-4">
              <Button variant="destructive" onClick={handleDeletePod} disabled={deletePodMutation.isPending}>
                {deletePodMutation.isPending ? "Deleting..." : "Delete"}
              </Button>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Pod Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedPod?.name}</DialogTitle>
          </DialogHeader>
          {selectedPod && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Current Amount</Label>
                  <p className="text-lg font-semibold">${selectedPod.currentAmount.toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Target Amount</Label>
                  <p className="text-lg font-semibold">${selectedPod.targetAmount.toLocaleString()}</p>
                </div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Progress</Label>
                <p className="text-lg font-semibold">
                  {Math.round((selectedPod.currentAmount / selectedPod.targetAmount) * 100)}%
                </p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Recent Activity</Label>
                <div className="space-y-2 mt-2">
                  <div className="text-sm">Amount via Round-Ups yesterday</div>
                  <div className="text-sm">Amount via Auto-Save 2 days ago</div>
                  <div className="text-sm">Amount via Cashback 3 days ago</div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Enhanced Pod Card Component
interface EnhancedPodCardProps {
  pod: Pod
  inflows: Inflow[]
  recentActivity: string
  onToggleFeatured: (podId: string) => void
  onEdit: (pod: Pod) => void
  onDelete: (pod: Pod) => void
  onView: (pod: Pod) => void
  onExport: (podId: string, podName: string) => void
}

function EnhancedPodCard({
  pod,
  inflows,
  recentActivity,
  onToggleFeatured,
  onEdit,
  onDelete,
  onView,
  onExport,
}: EnhancedPodCardProps) {
  const progress = pod.targetAmount > 0 ? (pod.currentAmount / pod.targetAmount) * 100 : 0

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-lg">{pod.name}</h3>
              {pod.isFeatured && <Star className="h-4 w-4 text-warning fill-warning" />}
            </div>
            <div className="text-sm text-muted-foreground mb-2">
              ${pod.currentAmount.toLocaleString()} of ${pod.targetAmount.toLocaleString()}
            </div>
            {recentActivity && (
              <div className="text-xs text-muted-foreground">{recentActivity}</div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="relative w-16 h-16">
              <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-muted-foreground/20"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-primary"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray={`${progress}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-semibold">{Math.round(progress)}%</span>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onView(pod)}>
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(pod)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Rename
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(pod)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit target/date
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onExport(pod.id, pod.name)}>
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete(pod)} className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {inflows.length > 0 && (
          <div className="space-y-3">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Active Inflows</div>
            <div className="flex flex-wrap gap-2">
              {inflows.map((inflow, index) => (
                <div
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary"
                >
                  {inflow.type === "roundups" && "Round-Ups"}
                  {inflow.type === "autosave" && "Auto-Save"}
                  {inflow.type === "cashback" && "Cashback"}
                  <span className="ml-1 text-muted-foreground">{inflow.amountLabel}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <Button size="sm" onClick={() => onView(pod)}>
            <Eye className="h-4 w-4 mr-2" />
            View
          </Button>
          <div className="flex items-center space-x-2">
            <Switch
              checked={pod.isFeatured}
              onCheckedChange={() => onToggleFeatured(pod.id)}
              size="sm"
            />
            <span className="text-xs text-muted-foreground">Feature % on profile</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-1">Public shows % only.</p>
      </CardContent>
    </Card>
  )
}
