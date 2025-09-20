"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/ui/glass-card"
import { GlowBadge } from "@/components/ui/glow-badge"
import { ApprovalPreview } from "@/components/ui/approval-preview"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { MessageSquare, Phone, Smartphone, X, Check, Zap, Target, Coins, CreditCard, Users } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

interface ChatMessage {
  id: string
  sender: "lonniee" | "user"
  content: string
  timestamp: number
  type?: "community-invite" | "challenge-suggestion" | "approval"
  data?: any
}

const demoMessages: ChatMessage[] = [
  {
    id: "1",
    sender: "lonniee",
    content: "New community challenge: 'Weekend No-Spend' — 1,200 people joined!",
    timestamp: 0
  },
  {
    id: "2",
    sender: "lonniee",
    content: "Want to join? It's a 2-day challenge to avoid non-essential spending.",
    timestamp: 2000,
    type: "community-invite",
    data: {
      challengeName: "Weekend No-Spend",
      participants: 1200,
      duration: "2 days",
      description: "Avoid non-essential spending for the weekend"
    }
  },
  {
    id: "3",
    sender: "user",
    content: "Sounds good! How does it work?",
    timestamp: 4000
  },
  {
    id: "4",
    sender: "lonniee",
    content: "I'll track your spending and suggest alternatives. You approve any transfers to your savings pod.",
    timestamp: 6000
  },
  {
    id: "5",
    sender: "lonniee",
    content: "Also found $25 in subscription savings this month. Want me to help you cancel the unused ones?",
    timestamp: 8000,
    type: "challenge-suggestion"
  }
]

export function MeetLonnieeSection() {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
  const [showApproval, setShowApproval] = useState(false)
  const [showChannelModal, setShowChannelModal] = useState<string | null>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex(prev => {
        if (prev < demoMessages.length - 1) {
          return prev + 1
        } else {
          // Show approval after last message
          if (prev === demoMessages.length - 1) {
            setShowApproval(true)
          }
          return prev
        }
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const currentMessages = demoMessages.slice(0, currentMessageIndex + 1)

  const channels = [
    {
      id: "whatsapp",
      name: "WhatsApp",
      icon: MessageSquare,
      description: "Get community updates and challenge invites",
      sample: "New challenge: Weekend No-Spend (1,200 joined). Want to participate? Reply YES.",
      color: "emerald"
    },
    {
      id: "sms",
      name: "SMS",
      icon: Smartphone,
      description: "Light nudges and community milestones",
      sample: "Your community hit 50% of monthly goal! 🎉 Keep it up!",
      color: "blue"
    },
    {
      id: "call",
      name: "Call-in",
      icon: Phone,
      description: "Voice IVR for community updates",
      sample: "Call (555) 123-LONN to hear community progress and join challenges",
      color: "purple"
    }
  ]

  return (
    <section id="lonniee" className="container mx-auto px-4 py-24 scroll-mt-24">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        {/* Left: Lonniee Portrait + Community Focus */}
        <div className="space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Lonniee — your community's AI savings conductor
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Suggests challenges, nudges members, verifies saves, and surfaces deals—consent-first and non-custodial.
            </p>
          </div>

          {/* Lonniee Portrait */}
          <div className="flex justify-center lg:justify-start">
            <div className="relative">
              <div className="w-32 h-32 flex items-center justify-center">
                <Image 
                  src="/Looniee-logo-main.svg" 
                  alt="Lonniee AI Logo" 
                  width={128} 
                  height={128}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="absolute inset-0 bg-emerald-500/10 blur-xl"></div>
            </div>
          </div>

          {/* Community Features */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Community Features</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-emerald-400" />
                <span className="text-sm text-white/70">Challenge suggestions</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-white/70">Member nudges</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-purple-400" />
                <span className="text-sm text-white/70">Save verification</span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-amber-400" />
                <span className="text-sm text-white/70">Deal finding</span>
              </div>
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
            <GlowBadge variant="emerald">Non-custodial</GlowBadge>
            <GlowBadge variant="blue">Consent-first</GlowBadge>
            <GlowBadge variant="purple">Privacy by default</GlowBadge>
          </div>

          <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white">
            <Link href="/agent">Talk to Lonniee</Link>
          </Button>
        </div>

        {/* Right: Community Chat Demo */}
        <div className="space-y-6">
          <GlassCard className="p-6" glow variant="premium">
            <div className="space-y-4">
              {/* Chat Messages */}
              <div className="space-y-3 max-h-80 overflow-y-auto">
                <AnimatePresence>
                  {currentMessages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`flex gap-3 ${message.sender === "user" ? "justify-end" : ""}`}
                    >
                      {message.sender === "lonniee" && (
                        <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                          <Image src="/Looniee-logo-main.svg" alt="Lonniee AI" width={16} height={16} className="w-4 h-4 object-contain" />
                        </div>
                      )}
                      <div className={`rounded-lg p-3 max-w-xs ${
                        message.sender === "user" 
                          ? "bg-emerald-600" 
                          : "bg-white/5"
                      }`}>
                        <p className="text-white text-sm">{message.content}</p>
                        
                        {/* Community invite data */}
                        {message.type === "community-invite" && message.data && (
                          <div className="mt-3 bg-white/5 rounded p-2">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-white font-medium text-xs">{message.data.challengeName}</span>
                              <span className="text-emerald-400 text-xs">{message.data.participants} joined</span>
                            </div>
                            <p className="text-white/60 text-xs">{message.data.description}</p>
                          </div>
                        )}

                        {/* Challenge suggestion data */}
                        {message.type === "challenge-suggestion" && (
                          <div className="mt-3 bg-white/5 rounded p-2">
                            <div className="flex items-center gap-2">
                              <CreditCard className="h-3 w-3 text-amber-400" />
                              <span className="text-white text-xs">Subscription Review</span>
                            </div>
                            <p className="text-emerald-400 text-xs mt-1">$25 potential savings</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Approval Preview */}
              <AnimatePresence>
                {showApproval && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <ApprovalPreview
                      title="Join Weekend No-Spend Challenge"
                      description="I'll help you avoid non-essential spending and suggest alternatives"
                      amount="Marketing demo only"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </GlassCard>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/5">
              <Users className="h-4 w-4 mr-2" />
              Suggest challenge
            </Button>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/5">
              <Target className="h-4 w-4 mr-2" />
              Nudge members
            </Button>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/5">
              <Coins className="h-4 w-4 mr-2" />
              Verify saves
            </Button>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/5">
              <CreditCard className="h-4 w-4 mr-2" />
              Find deals
            </Button>
          </div>
        </div>
      </div>

      {/* Channels Section */}
      <div className="mt-16 text-center">
        <h3 className="text-2xl font-bold text-white mb-6">Get community nudges where you live</h3>
        <p className="text-white/60 mb-8 max-w-2xl mx-auto">
          Chats, SMS, or call to get community updates and challenge invites. You always control permissions and can opt out anytime.
        </p>
        
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {channels.map((channel) => {
            const IconComponent = channel.icon
            return (
              <Dialog key={channel.id}>
                <DialogTrigger asChild>
                  <GlassCard className="p-6 cursor-pointer hover:scale-105 transition-transform" glow>
                    <div className="text-center">
                      <div className={`w-12 h-12 rounded-full bg-${channel.color}-500/20 flex items-center justify-center mx-auto mb-4`}>
                        <IconComponent className={`h-6 w-6 text-${channel.color}-400`} />
                      </div>
                      <h4 className="font-semibold text-white mb-2">{channel.name}</h4>
                      <p className="text-white/60 text-sm">{channel.description}</p>
                    </div>
                  </GlassCard>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <IconComponent className={`h-5 w-5 text-${channel.color}-400`} />
                      {channel.name} Integration
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      {channel.description}
                    </p>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <p className="text-sm font-medium mb-2">Sample message:</p>
                      <p className="text-sm text-muted-foreground italic">"{channel.sample}"</p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <p>• Opt-in required</p>
                      <p>• You control frequency</p>
                      <p>• Can opt out anytime</p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )
          })}
        </div>
      </div>
    </section>
  )
}
