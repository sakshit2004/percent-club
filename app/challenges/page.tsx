"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ChallengeCard } from "@/components/challenges/challenge-card"
import { SinkPodSelectorDialog } from "@/components/challenges/sink-pod-selector-dialog"
import { ChallengeCardSkeleton } from "@/components/common/loading-skeleton"
import { useChallenges, useToggleChallenge, useConfigureChallenge, usePods } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Zap, Info, Coins, Calendar, CreditCard, Trophy, Play, Pause, Settings, AlertCircle } from "lucide-react"
import type { Challenge } from "@/types"

export default function ChallengesPage() {
  const { data: challenges, isLoading, error } = useChallenges()
  const { data: pods } = usePods()
  const toggleChallengeMutation = useToggleChallenge()
  const configureChallengeMutation = useConfigureChallenge()
  const { toast } = useToast()

  // Dialog states
  const [sinkPodDialogOpen, setSinkPodDialogOpen] = useState(false)
  const [manageDialogOpen, setManageDialogOpen] = useState(false)
  const [configDialogOpen, setConfigDialogOpen] = useState(false)
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null)
  const [challengeConfig, setChallengeConfig] = useState<Record<string, any>>({})
  const [isPaused, setIsPaused] = useState(false)
  const [antiSpamDisabled, setAntiSpamDisabled] = useState(false)

  // Filter state
  const [activeFilter, setActiveFilter] = useState("all")

  const handleStartChallenge = (challengeId: string) => {
    const challenge = challenges?.find((c) => c.id === challengeId)
    if (!challenge) return

    if (challenge.isActive) {
      setSelectedChallenge(challenge)
      setManageDialogOpen(true)
      return
    }

    if (!pods || pods.length === 0) {
      toast({
        title: "No Pods Available",
        description: "Create a pod first to start challenges.",
        variant: "destructive",
      })
      return
    }

    setSelectedChallenge(challenge)
    setSinkPodDialogOpen(true)
  }

  const handleConfirmSinkPod = async (podId: string) => {
    if (!selectedChallenge) return

    try {
      await toggleChallengeMutation.mutateAsync({
        challengeId: selectedChallenge.id,
        isActive: true,
        sinkPodId: podId,
      })

      const pod = pods?.find((p) => p.id === podId)
      toast({
        title: `${selectedChallenge.name} started`,
        description: `→ ${pod?.name} pod`,
      })

      setSinkPodDialogOpen(false)
      setSelectedChallenge(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start challenge. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleToggleChallenge = async (challengeId: string, isActive: boolean) => {
    if (antiSpamDisabled) return

    setAntiSpamDisabled(true)
    setTimeout(() => setAntiSpamDisabled(false), 2000)

    try {
      await toggleChallengeMutation.mutateAsync({
        challengeId,
        isActive,
      })

      const challenge = challenges?.find((c) => c.id === challengeId)
      if (isActive) {
        toast({
          title: `${challenge?.name} started`,
          description: `Challenge is now active.`,
        })
      } else {
        toast({
          title: `${challenge?.name} paused`,
          description: `Challenge has been paused.`,
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update challenge. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleChangeSinkPod = async (podId: string) => {
    if (!selectedChallenge) return

    try {
      await toggleChallengeMutation.mutateAsync({
        challengeId: selectedChallenge.id,
        isActive: true,
        sinkPodId: podId,
      })

      const pod = pods?.find((p) => p.id === podId)
      toast({
        title: "Sink changed",
        description: `to ${pod?.name} pod`,
      })

      setManageDialogOpen(false)
      setSelectedChallenge(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to change sink pod. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleStopChallenge = async () => {
    if (!selectedChallenge) return

    try {
      await toggleChallengeMutation.mutateAsync({
        challengeId: selectedChallenge.id,
        isActive: false,
      })

      toast({
        title: `${selectedChallenge.name} stopped`,
        description: `Challenge has been deactivated.`,
      })

      setManageDialogOpen(false)
      setSelectedChallenge(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to stop challenge. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSaveConfig = async () => {
    if (!selectedChallenge) return

    try {
      await configureChallengeMutation.mutateAsync({
        challengeId: selectedChallenge.id,
        config: challengeConfig,
      })

      toast({
        title: "Configuration saved",
        description: `${selectedChallenge.name} settings updated.`,
      })
      setConfigDialogOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save configuration. Please try again.",
        variant: "destructive",
      })
    }
  }

  const openManageDialog = (challenge: Challenge) => {
    setSelectedChallenge(challenge)
    setIsPaused(!challenge.isActive)
    setManageDialogOpen(true)
  }

  const openConfigDialog = (challenge: Challenge) => {
    setSelectedChallenge(challenge)
    setChallengeConfig(challenge.config || {})
    setConfigDialogOpen(true)
  }

  const filteredChallenges = challenges?.filter((challenge) => {
    if (activeFilter === "all") return true
    return challenge.id === activeFilter
  }) || []

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Challenges</h1>
          <p className="text-muted-foreground">Prebuilt behaviors that pay into a sink pod.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <ChallengeCardSkeleton key={i} />
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
            <div className="text-destructive mb-2">Failed to load challenges</div>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Challenges</h1>
        <p className="text-muted-foreground">Prebuilt behaviors that pay into a sink pod.</p>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap gap-2 mb-8">
        {[
          { id: "all", label: "All" },
          { id: "roundups", label: "Round-Ups" },
          { id: "weekly-auto", label: "Weekly Auto-Save" },
          { id: "52-week", label: "52-Week" },
          { id: "cashback", label: "Cashback Hunt" },
        ].map((filter) => (
          <Button
            key={filter.id}
            variant={activeFilter === filter.id ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveFilter(filter.id)}
          >
            {filter.label}
          </Button>
        ))}
      </div>

      {/* Challenge Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {filteredChallenges.map((challenge) => (
          <EnhancedChallengeCard
            key={challenge.id}
            challenge={challenge}
            onStart={handleStartChallenge}
            onManage={openManageDialog}
            onConfigure={openConfigDialog}
            onToggle={handleToggleChallenge}
            isDisabled={antiSpamDisabled}
          />
        ))}
      </div>

      {/* Sink Pod Selector Dialog */}
      <SinkPodSelectorDialog
        open={sinkPodDialogOpen}
        onOpenChange={setSinkPodDialogOpen}
        challengeName={selectedChallenge?.name || ""}
        onConfirm={handleConfirmSinkPod}
        onCreatePod={() => {
          setSinkPodDialogOpen(false)
          // TODO: Navigate to pod creation
        }}
      />

      {/* Manage Challenge Dialog */}
      <Dialog open={manageDialogOpen} onOpenChange={setManageDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage {selectedChallenge?.name}</DialogTitle>
          </DialogHeader>
          {selectedChallenge && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Current sink pod</Label>
                <p className="text-sm text-muted-foreground">
                  {selectedChallenge.sinkPodName || "No pod selected"}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={selectedChallenge.isActive}
                  onCheckedChange={(checked) => handleToggleChallenge(selectedChallenge.id, checked)}
                />
                <Label>Status: {selectedChallenge.isActive ? "On" : "Paused"}</Label>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setManageDialogOpen(false)
                    setSinkPodDialogOpen(true)
                  }}
                >
                  Change sink pod
                </Button>
                <Button variant="destructive" onClick={handleStopChallenge}>
                  Stop challenge
                </Button>
              </div>

              <p className="text-xs text-muted-foreground">
                A challenge saves into its sink pod. You can change it anytime.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Configuration Dialog */}
      <Dialog open={configDialogOpen} onOpenChange={setConfigDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configure {selectedChallenge?.name}</DialogTitle>
          </DialogHeader>
          {selectedChallenge && (
            <div className="space-y-4">
              {selectedChallenge.id === "roundups" && (
                <>
                  <div>
                    <Label htmlFor="roundup-min">Minimum Round-up Amount</Label>
                    <Select
                      value={challengeConfig.minAmount || "0.50"}
                      onValueChange={(value) => setChallengeConfig({ ...challengeConfig, minAmount: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0.25">$0.25</SelectItem>
                        <SelectItem value="0.50">$0.50</SelectItem>
                        <SelectItem value="1.00">$1.00</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="roundup-max">Maximum Round-up Amount</Label>
                    <Select
                      value={challengeConfig.maxAmount || "5.00"}
                      onValueChange={(value) => setChallengeConfig({ ...challengeConfig, maxAmount: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2.00">$2.00</SelectItem>
                        <SelectItem value="5.00">$5.00</SelectItem>
                        <SelectItem value="10.00">$10.00</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {selectedChallenge.id === "weekly-auto" && (
                <div>
                  <Label htmlFor="weekly-amount">Weekly Amount</Label>
                  <Input
                    id="weekly-amount"
                    type="number"
                    value={challengeConfig.weeklyAmount || "50"}
                    onChange={(e) => setChallengeConfig({ ...challengeConfig, weeklyAmount: e.target.value })}
                    placeholder="50"
                  />
                </div>
              )}

              {selectedChallenge.id === "52-week" && (
                <div>
                  <Label htmlFor="start-amount">Starting Amount (Week 1)</Label>
                  <Select
                    value={challengeConfig.startAmount || "1.00"}
                    onValueChange={(value) => setChallengeConfig({ ...challengeConfig, startAmount: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1.00">$1.00</SelectItem>
                      <SelectItem value="2.00">$2.00</SelectItem>
                      <SelectItem value="5.00">$5.00</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {selectedChallenge.id === "cashback" && (
                <div>
                  <Label htmlFor="cashback-threshold">Minimum Cashback to Save</Label>
                  <Select
                    value={challengeConfig.threshold || "1.00"}
                    onValueChange={(value) => setChallengeConfig({ ...challengeConfig, threshold: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0.50">$0.50</SelectItem>
                      <SelectItem value="1.00">$1.00</SelectItem>
                      <SelectItem value="2.00">$2.00</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button onClick={handleSaveConfig} disabled={configureChallengeMutation.isPending}>
                  {configureChallengeMutation.isPending ? "Saving..." : "Save Configuration"}
                </Button>
                <Button variant="outline" onClick={() => setConfigDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Anti-spam helper */}
      {antiSpamDisabled && (
        <div className="fixed bottom-4 right-4 bg-background border rounded-lg p-3 shadow-lg">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <AlertCircle className="h-4 w-4" />
            Give it a sec—we'll apply your change.
          </div>
        </div>
      )}
    </div>
  )
}

// Enhanced Challenge Card Component
interface EnhancedChallengeCardProps {
  challenge: Challenge
  onStart: (challengeId: string) => void
  onManage: (challenge: Challenge) => void
  onConfigure: (challenge: Challenge) => void
  onToggle: (challengeId: string, isActive: boolean) => void
  isDisabled: boolean
}

function EnhancedChallengeCard({
  challenge,
  onStart,
  onManage,
  onConfigure,
  onToggle,
  isDisabled,
}: EnhancedChallengeCardProps) {
  const getIcon = () => {
    switch (challenge.id) {
      case "roundups":
        return <Coins className="h-6 w-6 text-primary" />
      case "weekly-auto":
        return <Calendar className="h-6 w-6 text-primary" />
      case "52-week":
        return <Trophy className="h-6 w-6 text-primary" />
      case "cashback":
        return <CreditCard className="h-6 w-6 text-primary" />
      default:
        return <Coins className="h-6 w-6 text-primary" />
    }
  }

  const getDescription = () => {
    switch (challenge.id) {
      case "roundups":
        return "Round your purchases; batched when pending ≥ $5"
      case "weekly-auto":
        return "Pick an amount or ask your Agent"
      case "52-week":
        return "A steady, increasing weekly save"
      case "cashback":
        return "Log deals & gift cards as saved"
      default:
        return challenge.description
    }
  }

  const getStatusPill = () => {
    if (!challenge.isActive) {
      return <Badge variant="outline">OFF</Badge>
    }
    return <Badge variant="default">ON</Badge>
  }

  const getPrimaryButton = () => {
    if (!challenge.isActive) {
      return (
        <Button
          onClick={() => onStart(challenge.id)}
          disabled={isDisabled}
          className="w-full"
        >
          <Play className="h-4 w-4 mr-2" />
          Start
        </Button>
      )
    }
    return (
      <Button
        variant="outline"
        onClick={() => onManage(challenge)}
        disabled={isDisabled}
        className="w-full"
      >
        <Settings className="h-4 w-4 mr-2" />
        Manage
      </Button>
    )
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
            {getIcon()}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-lg">{challenge.name}</h3>
              {getStatusPill()}
            </div>
            <p className="text-sm text-muted-foreground">{getDescription()}</p>
          </div>
        </div>

        <div className="space-y-3">
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

          <div className="pt-2">
            {getPrimaryButton()}
          </div>

          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onConfigure(challenge)}
              className="text-xs"
            >
              Learn more
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onConfigure(challenge)}
              className="text-xs"
            >
              <Settings className="h-3 w-3 mr-1" />
              Configure
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
