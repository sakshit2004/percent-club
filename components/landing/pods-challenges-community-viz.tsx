"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/ui/glass-card"
import { GlowBadge } from "@/components/ui/glow-badge"
import { PodProgressRing } from "@/components/pods/pod-progress-ring"
import { Coins, Calendar, TrendingUp, Users, ArrowRight, Zap } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

interface CommunityMember {
  id: string
  alias: string
  avatar: string
  position: { x: number; y: number }
  activeChallenges: string[]
}

interface CommunityPod {
  id: string
  name: string
  currentAmount: number
  targetAmount: number
  memberCount: number
  position: { x: number; y: number }
}

const communityMembers: CommunityMember[] = [
  {
    id: "1",
    alias: "@ace",
    avatar: "A",
    position: { x: 15, y: 20 },
    activeChallenges: ["roundups", "weekly"]
  },
  {
    id: "2", 
    alias: "@saver",
    avatar: "S",
    position: { x: 30, y: 15 },
    activeChallenges: ["roundups"]
  },
  {
    id: "3",
    alias: "@nova", 
    avatar: "N",
    position: { x: 45, y: 25 },
    activeChallenges: ["weekly", "52week"]
  },
  {
    id: "4",
    alias: "@thrifty",
    avatar: "T", 
    position: { x: 60, y: 18 },
    activeChallenges: ["roundups", "weekly", "52week"]
  },
  {
    id: "5",
    alias: "@wise",
    avatar: "W",
    position: { x: 75, y: 22 },
    activeChallenges: ["weekly"]
  }
]

const communityPod: CommunityPod = {
  id: "community-emergency",
  name: "Community Emergency Fund",
  currentAmount: 18750,
  targetAmount: 25000,
  memberCount: 5,
  position: { x: 50, y: 60 }
}

const challengeTypes = {
  roundups: { icon: Coins, color: "emerald", name: "Round-Ups" },
  weekly: { icon: Calendar, color: "blue", name: "Weekly Save" },
  "52week": { icon: TrendingUp, color: "purple", name: "52-Week" }
}

export function PodsChallengesCommunityViz() {
  const [activeFlow, setActiveFlow] = useState<string | null>(null)
  const [animationPhase, setAnimationPhase] = useState(0)
  const [showCelebration, setShowCelebration] = useState(false)

  // Cycle through different flows for demo
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase(prev => {
        const newPhase = (prev + 1) % 6
        if (newPhase === 5) {
          setShowCelebration(true)
          setTimeout(() => setShowCelebration(false), 2000)
        }
        return newPhase
      })
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  const getFlowOpacity = (memberId: string) => {
    if (activeFlow === memberId) return 1
    if (activeFlow === null && animationPhase === 0) return 0.7
    if (activeFlow === null && animationPhase === 1 && memberId === "1") return 1
    if (activeFlow === null && animationPhase === 2 && memberId === "2") return 1
    if (activeFlow === null && animationPhase === 3 && memberId === "3") return 1
    if (activeFlow === null && animationPhase === 4 && memberId === "4") return 1
    if (activeFlow === null && animationPhase === 5) return 1
    return 0.7
  }

  const getFlowAnimation = (memberId: string) => {
    if (activeFlow === memberId || (activeFlow === null && animationPhase >= 1)) return "animate-pulse"
    return ""
  }

  return (
    <section id="pods" className="container mx-auto px-4 py-24 scroll-mt-24">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        {/* Left: Explainer */}
        <div className="space-y-8">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Pods & Challenges — community momentum
            </h2>
            <p className="text-xl text-white/80 mb-6">
              Multiple members contribute to shared community goals through individual challenges. 
              Lonniee suggests challenges, members opt in, and progress aggregates in community pods.
            </p>
            <p className="text-white/60">
              Community pods show percent-only aggregation—balances stay private.
            </p>
          </div>

          {/* Community Stats */}
          <div className="grid grid-cols-2 gap-4">
            <GlassCard className="p-4" glow>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-400 mb-1">{communityMembers.length}</div>
                <div className="text-sm text-white/60">Active Members</div>
              </div>
            </GlassCard>
            <GlassCard className="p-4" glow>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400 mb-1">
                  {communityMembers.reduce((acc, member) => acc + member.activeChallenges.length, 0)}
                </div>
                <div className="text-sm text-white/60">Active Challenges</div>
              </div>
            </GlassCard>
          </div>

          <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white">
            <Link href="/pods">Start Your Community Pod</Link>
          </Button>
        </div>

        {/* Right: Multi-Member Flow Visualization */}
        <div className="relative h-[500px]">
          {/* SVG for flow lines */}
          <svg 
            className="absolute inset-0 w-full h-full pointer-events-none z-20" 
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {communityMembers.map((member) => (
              <g key={member.id}>
                {/* Flow line from member to community pod */}
                <line
                  x1={member.position.x}
                  y1={member.position.y + 15}
                  x2={communityPod.position.x}
                  y2={communityPod.position.y - 15}
                  stroke="rgb(34, 197, 94)"
                  strokeWidth="1.2"
                  opacity={getFlowOpacity(member.id)}
                  className={`transition-opacity duration-500 ${getFlowAnimation(member.id)}`}
                />
                {/* Animated packets */}
                {member.activeChallenges.map((challenge, index) => (
                  <circle
                    key={`${member.id}-${challenge}-${index}`}
                    r="0.4"
                    fill="rgb(34, 197, 94)"
                    opacity={getFlowOpacity(member.id)}
                    className={`transition-opacity duration-500 ${getFlowAnimation(member.id)}`}
                  >
                    <animateMotion
                      dur="2s"
                      repeatCount="indefinite"
                      path={`M ${member.position.x} ${member.position.y + 15} L ${communityPod.position.x} ${communityPod.position.y - 15}`}
                      begin={`${index * 0.5}s`}
                    />
                  </circle>
                ))}
              </g>
            ))}
          </svg>

          {/* Member Avatars */}
          <div className="relative z-10">
            {communityMembers.map((member) => (
              <div
                key={member.id}
                className="absolute"
                style={{
                  left: `${member.position.x}%`,
                  top: `${member.position.y}%`,
                  transform: "translate(-50%, -50%)"
                }}
              >
                <GlassCard 
                  className={`p-3 cursor-pointer transition-all duration-300 hover:scale-105 w-24 ${
                    activeFlow === member.id ? "ring-2 ring-emerald-400" : ""
                  }`}
                  glow
                  onMouseEnter={() => setActiveFlow(member.id)}
                  onMouseLeave={() => setActiveFlow(null)}
                >
                  <div className="text-center">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm mx-auto mb-2">
                      {member.avatar}
                    </div>
                    <h4 className="font-semibold text-white text-xs mb-1">{member.alias}</h4>
                    <div className="flex flex-wrap gap-1 justify-center">
                      {member.activeChallenges.map((challenge) => {
                        const challengeInfo = challengeTypes[challenge as keyof typeof challengeTypes]
                        const IconComponent = challengeInfo.icon
                        return (
                          <div key={challenge} className={`p-1 rounded bg-${challengeInfo.color}-500/20`}>
                            <IconComponent className={`h-3 w-3 text-${challengeInfo.color}-400`} />
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </GlassCard>
              </div>
            ))}
          </div>

          {/* Community Pod Card */}
          <div
            className="absolute z-10"
            style={{
              left: `${communityPod.position.x}%`,
              top: `${communityPod.position.y}%`,
              transform: "translate(-50%, -50%)"
            }}
          >
            <GlassCard className="p-6 w-80" glow variant="premium">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <PodProgressRing 
                    current={communityPod.currentAmount} 
                    target={communityPod.targetAmount} 
                    size={70} 
                  />
                </div>
                <div className="space-y-3">
                  <div>
                    <h3 className="font-bold text-white text-lg">{communityPod.name}</h3>
                    <p className="text-sm text-white/60">
                      ${communityPod.currentAmount.toLocaleString()} of ${communityPod.targetAmount.toLocaleString()}
                    </p>
                    <p className="text-xs text-white/60">
                      {Math.round((communityPod.currentAmount / communityPod.targetAmount) * 100)}% complete
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Users className="h-4 w-4 text-emerald-400" />
                    <span className="text-sm text-white/60">{communityPod.memberCount} members contributing</span>
                  </div>
                  <div className="flex gap-2 flex-wrap justify-center">
                    <GlowBadge variant="emerald" size="sm">Round-Ups</GlowBadge>
                    <GlowBadge variant="blue" size="sm">Auto-Save</GlowBadge>
                    <GlowBadge variant="purple" size="sm">52-Week</GlowBadge>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Celebration Effect */}
          <AnimatePresence>
            {showCelebration && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none"
              >
                <div className="text-6xl">🎉</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Flow Legend */}
      <div className="mt-8">
        <GlassCard className="p-4" variant="subtle">
          <div className="flex items-center justify-between text-xs text-white/60">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span>Individual savings flow to community pod</span>
              </div>
              <div className="flex items-center gap-2">
                <ArrowRight className="h-3 w-3" />
                <span>Percent-only aggregation</span>
              </div>
            </div>
            <Button 
              size="sm" 
              variant="outline" 
              className="border-white/20 text-white hover:bg-white/5"
              onClick={() => setActiveFlow(activeFlow ? null : "1")}
            >
              <Zap className="h-3 w-3 mr-1" />
              {activeFlow ? "Stop Demo" : "Start Demo"}
            </Button>
          </div>
        </GlassCard>
      </div>
    </section>
  )
}
