"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { PodProgressRing } from "@/components/pods/pod-progress-ring"
import { usePods } from "@/lib/api"
import { formatCurrency } from "@/lib/format"
import { Plus, Target } from "lucide-react"

interface SinkPodSelectorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  challengeName: string
  onConfirm: (podId: string) => void
  onCreatePod?: () => void
}

export function SinkPodSelectorDialog({
  open,
  onOpenChange,
  challengeName,
  onConfirm,
  onCreatePod,
}: SinkPodSelectorDialogProps) {
  const { data: pods, isLoading } = usePods()
  const [selectedPodId, setSelectedPodId] = useState<string>("")

  const handleConfirm = () => {
    if (selectedPodId) {
      onConfirm(selectedPodId)
      onOpenChange(false)
      setSelectedPodId("")
    }
  }

  const handleCancel = () => {
    onOpenChange(false)
    setSelectedPodId("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Connect {challengeName} to a Pod</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Choose which savings pod will receive deposits from this challenge.
          </p>
        </DialogHeader>

        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="text-muted-foreground">Loading pods...</div>
            </div>
          ) : !pods || pods.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <Target className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">No pods available</h3>
                <p className="text-sm text-muted-foreground text-center mb-4">
                  You need to create a savings pod before connecting challenges.
                </p>
                {onCreatePod && (
                  <Button onClick={onCreatePod}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Pod
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <RadioGroup value={selectedPodId} onValueChange={setSelectedPodId}>
              <div className="grid gap-3 max-h-96 overflow-y-auto">
                {pods.map((pod) => (
                  <div key={pod.id} className="flex items-center space-x-3">
                    <RadioGroupItem value={pod.id} id={pod.id} />
                    <Label htmlFor={pod.id} className="flex-1 cursor-pointer">
                      <Card className="hover:bg-muted/50 transition-colors">
                        <CardContent className="flex items-center gap-4 p-4">
                          <PodProgressRing
                            current={pod.currentAmount}
                            target={pod.targetAmount}
                            size={48}
                            strokeWidth={4}
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{pod.name}</h4>
                              {pod.isFeatured && (
                                <Badge variant="outline" className="text-xs">
                                  Featured
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {formatCurrency(pod.currentAmount)} of {formatCurrency(pod.targetAmount)}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          )}

          {onCreatePod && pods && pods.length > 0 && (
            <Button variant="outline" onClick={onCreatePod} className="w-full bg-transparent">
              <Plus className="h-4 w-4 mr-2" />
              Create New Pod
            </Button>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!selectedPodId || isLoading}>
            Connect Challenge
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
