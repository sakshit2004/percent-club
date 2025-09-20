"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/ui/glass-card"
import { GlowBadge } from "@/components/ui/glow-badge"
import { ApprovalPreview } from "@/components/ui/approval-preview"
import { FlowVisualization } from "@/components/ui/flow-visualization"
import { Coins, Calendar, TrendingUp, Check, X } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

interface Challenge {
  id: string
  name: string
  description: string
  icon: React.ComponentType<any>
  color: string
  amount: string
  frequency: string
}

const challenges: Challenge[] = [
  {
    id: "roundups",
    name: "Round-Ups",
    description: "Micro-savings that batch and post when you approve",
    icon: Coins,
    color: "emerald",
    amount: "$2.50",
    frequency: "per purchase"
  },
  {
    id: "weekly",
    name: "Weekly Auto-Save",
    description: "Personalized amounts and scheduled nudges",
    icon: Calendar,
    color: "blue",
    amount: "$25",
    frequency: "weekly"
  },
  {
    id: "52week",
    name: "52-Week Challenge",
    description: "Steady momentum building your savings habit",
    icon: TrendingUp,
    color: "purple",
    amount: "$12",
    frequency: "this week"
  }
]

export function PodsAsOffersSection() {
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null)
  const [showApproval, setShowApproval] = useState(false)

  const handleChallengeAccept = (challengeId: string) => {
    setSelectedChallenge(challengeId)
    setShowApproval(true)
  }

  const handleApprovalResponse = (approved: boolean) => {
    setShowApproval(false)
    setSelectedChallenge(null)
    // In a real app, this would trigger the actual challenge setup
  }

  return (
    <section id="pods" className="container mx-auto px-4 py-24 scroll-mt-24">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        {/* Left: Explainer + Challenge Cards */}
        <div className="space-y-8">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Challenges — suggested by Lonniee, routed to your goals
            </h2>
            <p className="text-xl text-white/80 mb-6">
              Lonniee suggests challenges (Round-Ups, Weekly Auto-Save, 52-Week) and asks: "Want to join?" 
              If you accept, Lonniee guides transfers and verifies them — Pods are the sink ledger that tracks progress.
            </p>
            <p className="text-white/60">
              Choose a sink pod. Money stays in your bank—we track verified saves.
            </p>
          </div>

          {/* Challenge Cards */}
          <div className="space-y-4">
            {challenges.map((challenge) => {
              const IconComponent = challenge.icon
              return (
                <motion.div
                  key={challenge.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: challenges.indexOf(challenge) * 0.1 }}
                >
                  <GlassCard className="p-4" glow>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-lg bg-${challenge.color}-500/20`}>
                          <IconComponent className={`h-6 w-6 text-${challenge.color}-400`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{challenge.name}</h3>
                          <p className="text-sm text-white/60">{challenge.description}</p>
                          <p className="text-xs text-white/50">{challenge.amount} {challenge.frequency}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-white/20 text-white hover:bg-white/5"
                          onClick={() => handleChallengeAccept(challenge.id)}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Yes
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-white/20 text-white hover:bg-white/5"
                        >
                          <X className="h-4 w-4 mr-1" />
                          No
                        </Button>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              )
            })}
          </div>

          <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white">
            <Link href="/challenges">Explore all challenges</Link>
          </Button>
        </div>

        {/* Right: Interactive Flow Visualization */}
        <div className="relative h-[500px]">
          <FlowVisualization className="w-full h-full" />
          
          {/* Overlay text */}
          <div className="absolute bottom-4 left-4 right-4 z-30">
            <GlassCard className="p-4" variant="subtle">
              <div className="text-center">
                <p className="text-sm text-white/80 mb-2">
                  <span className="text-emerald-400">Lonniee</span> suggests challenges → You approve → Money flows to your Pod
                </p>
                <div className="flex items-center justify-center gap-4 text-xs text-white/60">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span>Verified savings only</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-3 w-3" />
                    <span>Your approval required</span>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>

      {/* Approval Modal */}
      <AnimatePresence>
        {showApproval && selectedChallenge && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-md w-full"
            >
              <ApprovalPreview
                title="Challenge Setup"
                description={`Lonniee will guide you through setting up the ${challenges.find(c => c.id === selectedChallenge)?.name} challenge. You'll approve each transfer.`}
                amount="Marketing demo only"
                onApprove={() => handleApprovalResponse(true)}
                onCancel={() => handleApprovalResponse(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
