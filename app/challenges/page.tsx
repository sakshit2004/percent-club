"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChallengeCard } from "@/components/challenges/challenge-card"
import { SinkPodSelectorDialog } from "@/components/challenges/sink-pod-selector-dialog"
import { ChallengeCardSkeleton } from "@/components/common/loading-skeleton"
import { useChallenges, useToggleChallenge, useConfigureChallenge } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Zap, Info } from "lucide-react"

export default function ChallengesPage() {
  const { data: challenges, isLoading, error } = useChallenges()
  const toggleChallengeMutation = useToggleChallenge()
  const configureChallengeMutation = useConfigureChallenge()
  const { toast } = useToast()

  const [sinkPodDialogOpen, setSinkPodDialogOpen] = useState(false)
  const [configDialogOpen, setConfigDialogOpen] = useState(false)
  const [selectedChallenge, setSelectedChallenge] = useState<string>("")
  const [challengeConfig, setChallengeConfig] = useState<Record<string, any>>({})

  const handleStartChallenge = (challengeId: string) => {
    const challenge = challenges?.find((c) => c.id === challengeId)
    if (!challenge) return

    if (challenge.isActive) {
      // If already active, just show toast
      toast({
        title: "Challenge Already Active",
        description: `${challenge.name} is already running.`,
      })
      return
    }

    setSelectedChallenge(challengeId)
    setSinkPodDialogOpen(true)
  }

  const handleStopChallenge = async (challengeId: string) => {
    try {
      await toggleChallengeMutation.mutateAsync({
        challengeId,
        isActive: false,
      })

      const challenge = challenges?.find((c) => c.id === challengeId)
      toast({
        title: "Challenge Stopped",
        description: `${challenge?.name} has been deactivated.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to stop challenge. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleConfigureChallenge = (challengeId: string) => {
    const challenge = challenges?.find((c) => c.id === challengeId)
    if (!challenge) return

    setSelectedChallenge(challengeId)
    setChallengeConfig(challenge.config || {})
    setConfigDialogOpen(true)
  }

  const handleConfirmSinkPod = async (podId: string) => {
    try {
      await toggleChallengeMutation.mutateAsync({
        challengeId: selectedChallenge,
        isActive: true,
        sinkPodId: podId,
      })

      const challenge = challenges?.find((c) => c.id === selectedChallenge)
      toast({
        title: "Challenge Started",
        description: `${challenge?.name} is now active and connected to your pod.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start challenge. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSaveConfig = async () => {
    try {
      await configureChallengeMutation.mutateAsync({
        challengeId: selectedChallenge,
        config: challengeConfig,
      })

      const challenge = challenges?.find((c) => c.id === selectedChallenge)
      toast({
        title: "Configuration Saved",
        description: `${challenge?.name} settings have been updated.`,
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

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Challenges</h1>
          <p className="text-muted-foreground">Automate your savings with smart challenges</p>
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

  const activeChallenges = challenges?.filter((c) => c.isActive) || []
  const inactiveChallenges = challenges?.filter((c) => !c.isActive) || []

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Challenges</h1>
        <p className="text-muted-foreground">Automate your savings with smart challenges</p>
      </div>

      {/* Info Banner */}
      <Card className="mb-8 bg-info/5 border-info/20">
        <CardContent className="flex items-start gap-3 p-6">
          <Info className="h-5 w-5 text-info mt-0.5" />
          <div>
            <h3 className="font-semibold text-info mb-1">How Challenges Work</h3>
            <p className="text-sm text-muted-foreground">
              Each challenge must be connected to a savings pod. When you activate a challenge, it will automatically
              deposit money into your chosen pod based on the challenge rules.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Active Challenges */}
      {activeChallenges.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Active Challenges</h2>
            <Badge variant="secondary">{activeChallenges.length}</Badge>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {activeChallenges.map((challenge) => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                onStart={handleStartChallenge}
                onStop={handleStopChallenge}
                onConfigure={handleConfigureChallenge}
              />
            ))}
          </div>
        </div>
      )}

      {/* Available Challenges */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-xl font-semibold">
            {activeChallenges.length > 0 ? "Available Challenges" : "All Challenges"}
          </h2>
          <Badge variant="outline">{inactiveChallenges.length}</Badge>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {inactiveChallenges.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              onStart={handleStartChallenge}
              onStop={handleStopChallenge}
              onConfigure={handleConfigureChallenge}
            />
          ))}
        </div>
      </div>

      {/* Sink Pod Selector Dialog */}
      <SinkPodSelectorDialog
        open={sinkPodDialogOpen}
        onOpenChange={setSinkPodDialogOpen}
        challengeName={challenges?.find((c) => c.id === selectedChallenge)?.name || ""}
        onConfirm={handleConfirmSinkPod}
        onCreatePod={() => {
          setSinkPodDialogOpen(false)
          // TODO: Navigate to pod creation or open pod creation dialog
        }}
      />

      {/* Configuration Dialog */}
      <Dialog open={configDialogOpen} onOpenChange={setConfigDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configure {challenges?.find((c) => c.id === selectedChallenge)?.name}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {selectedChallenge === "roundups" && (
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

            {selectedChallenge === "weekly-auto" && (
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

            {selectedChallenge === "52-week" && (
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

            {selectedChallenge === "cashback" && (
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
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={handleSaveConfig} disabled={configureChallengeMutation.isPending}>
              {configureChallengeMutation.isPending ? "Saving..." : "Save Configuration"}
            </Button>
            <Button variant="outline" onClick={() => setConfigDialogOpen(false)}>
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
