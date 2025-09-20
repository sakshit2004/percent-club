"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/ui/glass-card"
import { GlowBadge } from "@/components/ui/glow-badge"
import { ApprovalPreview } from "@/components/ui/approval-preview"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { MessageSquare, Phone, Smartphone, X, Check, Zap, Target, Coins, CreditCard } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

interface ChatMessage {
  id: string
  sender: "lonniee" | "user"
  content: string
  timestamp: number
  type?: "subscription" | "suggestion" | "approval"
  data?: any
}

const demoMessages: ChatMessage[] = [
  {
    id: "1",
    sender: "lonniee",
    content: "Running your monthly subscription review...",
    timestamp: 0
  },
  {
    id: "2",
    sender: "lonniee",
    content: "Found 2 potential savings opportunities:",
    timestamp: 2000,
    type: "subscription",
    data: [
      { name: "Streaming", issue: "Duplicate subscription", savings: "$15/mo" },
      { name: "Phone Plan", issue: "Overpriced plan", savings: "$25/mo" }
    ]
  },
  {
    id: "3",
    sender: "user",
    content: "What do you recommend?",
    timestamp: 4000
  },
  {
    id: "4",
    sender: "lonniee",
    content: "I suggest canceling the duplicate streaming service and switching to a cheaper phone plan. This could save you $40/month.",
    timestamp: 6000
  },
  {
    id: "5",
    sender: "lonniee",
    content: "Also, based on your spending patterns, you could safely save $50 weekly. Want me to set this up?",
    timestamp: 8000,
    type: "suggestion"
  }
]

export function LonnieeShowcase() {
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
      description: "Chat with Lonniee directly in WhatsApp",
      sample: "Hey! I found $40 in monthly savings. Want me to help you cancel that duplicate subscription?",
      color: "emerald"
    },
    {
      id: "sms",
      name: "SMS",
      icon: Smartphone,
      description: "Get light nudges via text message",
      sample: "Weekly save reminder: You can safely save $50 this week. Reply YES to approve.",
      color: "blue"
    },
    {
      id: "call",
      name: "Call-in",
      icon: Phone,
      description: "Voice IVR to talk with Lonniee",
      sample: "Call (555) 123-LONN to speak with your AI assistant",
      color: "purple"
    }
  ]

  return (
    <section id="lonniee" className="container mx-auto px-4 py-24 scroll-mt-24">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        {/* Left: Lonniee Portrait + Badges */}
        <div className="space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Meet Lonniee — your personalized finance expert
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Ask anything about your spend. Lonniee finds waste, proposes safe weekly saves, 
              and hunts deals—then waits for your approval.
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

        {/* Right: Interactive Chat Demo */}
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
                        
                        {/* Subscription data */}
                        {message.type === "subscription" && message.data && (
                          <div className="mt-3 space-y-2">
                            {message.data.map((sub: any, index: number) => (
                              <div key={index} className="bg-white/5 rounded p-2">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <p className="text-white font-medium text-xs">{sub.name}</p>
                                    <p className="text-white/60 text-xs">{sub.issue}</p>
                                  </div>
                                  <p className="text-emerald-400 font-semibold text-xs">{sub.savings}</p>
                                </div>
                              </div>
                            ))}
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
                      title="You can safely save weekly"
                      description="Based on your spending patterns and available balance"
                      amount="Normal risk level"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </GlassCard>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/5">
              <Zap className="h-4 w-4 mr-2" />
              Run review
            </Button>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/5">
              <Target className="h-4 w-4 mr-2" />
              Suggest save
            </Button>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/5">
              <Coins className="h-4 w-4 mr-2" />
              Post round-ups
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
        <h3 className="text-2xl font-bold text-white mb-6">Get nudges where you live</h3>
        <p className="text-white/60 mb-8 max-w-2xl mx-auto">
          Chats, SMS, or call to talk with Lonniee. You always control permissions and can opt out anytime.
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
