"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Coins, Calendar, TrendingUp, Target, ArrowRight, Zap } from "lucide-react"
import { PodProgressRing } from "@/components/pods/pod-progress-ring"
import { GlassCard } from "@/components/ui/glass-card"
import { GlowBadge } from "@/components/ui/glow-badge"

interface FlowVisualizationProps {
  className?: string
}

interface Challenge {
  id: string
  name: string
  icon: React.ComponentType<any>
  color: string
  amount: number
  frequency: string
  isActive: boolean
  position: { x: number; y: number }
}

interface Pod {
  id: string
  name: string
  currentAmount: number
  targetAmount: number
  position: { x: number; y: number }
}

const mockChallenges: Challenge[] = [
  {
    id: "roundups",
    name: "Round-Ups",
    icon: Coins,
    color: "emerald",
    amount: 2.50,
    frequency: "per purchase",
    isActive: true,
    position: { x: 30, y: 20 }
  },
  {
    id: "weekly",
    name: "Weekly Auto-Save",
    icon: Calendar,
    color: "blue",
    amount: 25,
    frequency: "weekly",
    isActive: true,
    position: { x: 50, y: 20 }
  },
  {
    id: "52week",
    name: "52-Week Challenge",
    icon: TrendingUp,
    color: "purple",
    amount: 12,
    frequency: "this week",
    isActive: true,
    position: { x: 70, y: 20 }
  }
]

const mockPod: Pod = {
  id: "savings",
  name: "Emergency Fund",
  currentAmount: 3750,
  targetAmount: 5000,
  position: { x: 50, y: 50 }
}

export function FlowVisualization({ className }: FlowVisualizationProps) {
  const [activeFlow, setActiveFlow] = useState<string | null>(null)
  const [animationPhase, setAnimationPhase] = useState(0)

  // Cycle through different flows for demo
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % 4)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  const getFlowOpacity = (challengeId: string) => {
    if (activeFlow === challengeId) return 1
    if (activeFlow === null && animationPhase === 0) return 0.7
    if (activeFlow === null && animationPhase === 1 && challengeId === "roundups") return 1
    if (activeFlow === null && animationPhase === 2 && challengeId === "weekly") return 1
    if (activeFlow === null && animationPhase === 3 && challengeId === "52week") return 1
    return 0.7
  }

  const getFlowAnimation = (challengeId: string) => {
    if (activeFlow === challengeId || (activeFlow === null && animationPhase === 1 && challengeId === "roundups")) return "animate-pulse"
    if (activeFlow === null && animationPhase === 2 && challengeId === "weekly") return "animate-pulse"
    if (activeFlow === null && animationPhase === 3 && challengeId === "52week") return "animate-pulse"
    return ""
  }

  return (
    <div className={`relative ${className}`}>
      {/* SVG for flow lines */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none z-20" 
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
         {mockChallenges.map((challenge) => (
           <g key={challenge.id}>
             {/* Flow line - straight vertical line from challenge to pod */}
             <line
               x1={challenge.position.x}
               y1={challenge.position.y + 15}
               x2={mockPod.position.x}
               y2={mockPod.position.y - 15}
               stroke={`rgb(34, 197, 94)`}
               strokeWidth="1.2"
               opacity={getFlowOpacity(challenge.id)}
               className={`transition-opacity duration-500 ${getFlowAnimation(challenge.id)}`}
             />
             {/* Animated dots */}
             <circle
               r="0.4"
               fill="rgb(34, 197, 94)"
               opacity={getFlowOpacity(challenge.id)}
               className={`transition-opacity duration-500 ${getFlowAnimation(challenge.id)}`}
             >
               <animateMotion
                 dur="2s"
                 repeatCount="indefinite"
                 path={`M ${challenge.position.x} ${challenge.position.y + 15} L ${mockPod.position.x} ${mockPod.position.y - 15}`}
               />
             </circle>
           </g>
         ))}
      </svg>

      {/* Challenge Cards - Horizontally aligned at top */}
      <div className="relative z-10">
        {mockChallenges.map((challenge) => {
          const IconComponent = challenge.icon
          return (
            <div
              key={challenge.id}
              className="absolute"
              style={{
                left: `${challenge.position.x}%`,
                top: `${challenge.position.y}%`,
                transform: "translate(-50%, -50%)"
              }}
            >
              <GlassCard 
                className={`p-3 cursor-pointer transition-all duration-300 hover:scale-105 w-32 ${
                  activeFlow === challenge.id ? "ring-2 ring-emerald-400" : ""
                }`}
                glow
                onMouseEnter={() => setActiveFlow(challenge.id)}
                onMouseLeave={() => setActiveFlow(null)}
              >
                <div className="text-center">
                  <div className={`p-2 rounded-lg bg-${challenge.color}-500/20 mx-auto mb-2 w-fit`}>
                    <IconComponent className={`h-4 w-4 text-${challenge.color}-400`} />
                  </div>
                  <h4 className="font-semibold text-white text-sm mb-1">{challenge.name}</h4>
                  <p className="text-xs text-white/60 mb-2">${challenge.amount} {challenge.frequency}</p>
                  <GlowBadge 
                    variant={challenge.color as any} 
                    size="sm"
                  >
                    {challenge.isActive ? "Active" : "Inactive"}
                  </GlowBadge>
                </div>
              </GlassCard>
            </div>
          )
        })}
      </div>

      {/* Central Pod Card - Centered below challenges */}
      <div
        className="absolute z-10"
        style={{
          left: `${mockPod.position.x}%`,
          top: `${mockPod.position.y}%`,
          transform: "translate(-50%, -50%)"
        }}
      >
        <GlassCard className="p-6 w-72" glow variant="premium">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <PodProgressRing 
                current={mockPod.currentAmount} 
                target={mockPod.targetAmount} 
                size={70} 
              />
            </div>
            <div className="space-y-3">
              <div>
                <h3 className="font-bold text-white text-lg">{mockPod.name}</h3>
                <p className="text-sm text-white/60">
                  ${mockPod.currentAmount.toLocaleString()} of ${mockPod.targetAmount.toLocaleString()}
                </p>
                <p className="text-xs text-white/60">
                  {Math.round((mockPod.currentAmount / mockPod.targetAmount) * 100)}% complete
                </p>
              </div>
              <div className="flex gap-2 flex-wrap justify-center">
                <GlowBadge variant="emerald" size="sm">Round-Ups</GlowBadge>
                <GlowBadge variant="blue" size="sm">Auto-Save</GlowBadge>
                <GlowBadge variant="purple" size="sm">52-Week</GlowBadge>
              </div>
              <p className="text-xs text-white/60">3 active challenges feeding this pod</p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Flow Legend */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <GlassCard className="p-4" variant="subtle">
          <div className="flex items-center justify-between text-xs text-white/60">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span>Money flows from challenges to pod</span>
              </div>
              <div className="flex items-center gap-2">
                <ArrowRight className="h-3 w-3" />
                <span>Verified savings only</span>
              </div>
            </div>
            <Button 
              size="sm" 
              variant="outline" 
              className="border-white/20 text-white hover:bg-white/5"
              onClick={() => setActiveFlow(activeFlow ? null : "roundups")}
            >
              <Zap className="h-3 w-3 mr-1" />
              {activeFlow ? "Stop Demo" : "Start Demo"}
            </Button>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
