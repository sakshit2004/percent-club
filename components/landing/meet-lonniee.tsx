"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Bot, Shield, Lock, Eye, CheckCircle, CreditCard, TrendingDown, Gift, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/ui/glass-card"
import { Badge } from "@/components/ui/badge"

const demoMessages = [
  {
    id: 1,
    type: "lonniee",
    text: "Hi! I'm Lonniee, your private finance coach. I can help you clean up subscriptions, find safe-to-save amounts, and discover cashback offers. What's your biggest financial challenge?",
    time: "2:30 PM"
  },
  {
    id: 2,
    type: "user",
    text: "I feel like I'm spending too much on subscriptions but I'm not sure which ones to cancel.",
    time: "2:31 PM"
  },
  {
    id: 3,
    type: "lonniee",
    text: "I found 3 subscriptions you might not need: Netflix ($15/mo), unused gym membership ($29/mo), and premium music service ($10/mo). That's $54/month in potential savings!",
    time: "2:34 PM"
  },
  {
    id: 4,
    type: "user",
    text: "Wow, that's a lot! How do I cancel them?",
    time: "2:35 PM"
  },
  {
    id: 5,
    type: "lonniee",
    text: "I'll prepare cancellation emails for you. For the gym, I recommend calling during business hours. Want me to draft the emails and set up automatic transfers to your emergency fund?",
    time: "2:36 PM"
  },
  {
    id: 6,
    type: "user",
    text: "Yes, please! Also, how much can I safely save each week?",
    time: "2:37 PM"
  },
  {
    id: 7,
    type: "lonniee",
    text: "Based on your spending patterns, you can safely save $75/week. I'll help you set up automatic transfers and track your progress privately. This keeps a healthy buffer for unexpected expenses.",
    time: "2:38 PM"
  },
  {
    id: 8,
    type: "user",
    text: "That sounds great! Any cashback opportunities?",
    time: "2:39 PM"
  },
  {
    id: 9,
    type: "lonniee",
    text: "I found 5 cashback offers for your recent purchases: 3% back on groceries, 5% on gas, and 2% on dining. Want me to activate them? This could save you an additional $45/month.",
    time: "2:40 PM"
  }
]

const features = [
  {
    icon: <CreditCard className="h-5 w-5" />,
    title: "Subscription Cleanup",
    description: "Find and cancel unused subscriptions automatically",
    color: "blue"
  },
  {
    icon: <TrendingDown className="h-5 w-5" />,
    title: "Safe-to-Save Analysis",
    description: "Calculate how much you can safely save each week",
    color: "emerald"
  },
  {
    icon: <Gift className="h-5 w-5" />,
    title: "Cashback Discovery",
    description: "Find personalized cashback offers for your purchases",
    color: "purple"
  }
]

const privacyFeatures = [
  { icon: <Lock className="h-4 w-4" />, text: "End-to-end encryption" },
  { icon: <Eye className="h-4 w-4" />, text: "Read-only access" },
  { icon: <Shield className="h-4 w-4" />, text: "Never moves your money" },
]

export function MeetLonniee() {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentMessageIndex < demoMessages.length - 1) {
        setIsTyping(true)
        setTimeout(() => {
          setCurrentMessageIndex(prev => prev + 1)
          setIsTyping(false)
        }, 1200)
      } else {
        // Reset after showing all messages
        setTimeout(() => {
          setCurrentMessageIndex(0)
        }, 4000)
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [currentMessageIndex])

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
    }
  }, [currentMessageIndex, isTyping])

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "from-blue-500/20 to-blue-600/20 border-blue-500/30",
      emerald: "from-emerald-500/20 to-emerald-600/20 border-emerald-500/30",
      purple: "from-purple-500/20 to-purple-600/20 border-purple-500/30",
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  return (
    <section id="lonniee" className="py-20 md:py-32 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl animate-blob-1"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-blob-2"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <Badge variant="outline" className="mb-4 border-emerald-500/30 text-emerald-400">
                <Bot className="h-4 w-4 mr-2" />
                Private Finance Coach
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Meet <span className="text-emerald-400">Lonniee</span> — your private finance coach
              </h2>
              <p className="text-xl text-white/70 mb-8">
                Your personal AI assistant that works privately to optimize your finances, 
                clean up subscriptions, and find savings opportunities.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-4"
                >
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${getColorClasses(feature.color)}`}>
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">{feature.title}</h3>
                    <p className="text-white/70">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Privacy Features */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">Your Privacy is Protected</h3>
              <div className="space-y-3">
                {privacyFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="p-1 rounded bg-emerald-500/20">
                      {feature.icon}
                    </div>
                    <span className="text-white/70 text-sm">{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <Button size="lg" asChild className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 text-lg">
              <Link href="/#lonniee">
                <Bot className="mr-2 h-5 w-5" />
                Start with Lonniee
              </Link>
            </Button>
          </motion.div>

          {/* Right: Demo Chat */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            <GlassCard className="p-6" glow variant="premium">
              {/* Chat Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center overflow-hidden">
                    <Image 
                      src="/Looniee-logo-main.svg" 
                      alt="Lonniee" 
                      width={24} 
                      height={24}
                      className="w-6 h-6"
                    />
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-ping"></div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Lonniee</h3>
                  <p className="text-xs text-white/60">Private Finance Coach • Online</p>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-emerald-400">Active</span>
                </div>
              </div>

              {/* Chat Messages */}
              <div ref={messagesContainerRef} className="space-y-4 max-h-96 overflow-y-auto pr-2 mb-6">
                <AnimatePresence>
                  {demoMessages.slice(0, currentMessageIndex + 1).map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`rounded-2xl p-3 max-w-xs ${
                        message.type === 'user' 
                          ? 'bg-emerald-500/20 rounded-br-md' 
                          : 'bg-white/10 rounded-bl-md'
                      }`}>
                        <p className="text-white text-sm">{message.text}</p>
                        <div className="flex items-center gap-1 mt-2">
                          {message.type === 'lonniee' && (
                            <Image 
                              src="/Looniee-logo-main.svg" 
                              alt="Lonniee" 
                              width={12} 
                              height={12}
                              className="w-3 h-3"
                            />
                          )}
                          <span className="text-white/50 text-xs">
                            {message.type === 'user' ? 'You' : 'Lonniee'} • {message.time}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  {/* Typing Indicator */}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="bg-white/10 rounded-2xl rounded-bl-md p-3">
                        <div className="flex items-center gap-1">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                          <span className="text-white/50 text-xs ml-2">Lonniee is typing...</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Chat Input */}
              <div className="pt-4 border-t border-white/10">
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-white/5 rounded-full px-4 py-2">
                    <input
                      type="text"
                      placeholder="Ask Lonniee about your finances..."
                      className="w-full bg-transparent text-white text-sm placeholder-white/50 outline-none"
                      disabled
                    />
                  </div>
                  <Button 
                    size="sm" 
                    disabled
                    className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
