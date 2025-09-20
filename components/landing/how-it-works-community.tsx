"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/ui/glass-card"
import { GlowBadge } from "@/components/ui/glow-badge"
import { Users, Target, CheckCircle, ArrowRight, Shield, Lock, EyeOff, ChevronDown, ChevronUp } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

interface Step {
  id: number
  title: string
  description: string
  icon: React.ComponentType<any>
  color: string
  details: string[]
  trustNote?: string
}

const steps: Step[] = [
  {
    id: 1,
    title: "Join or create a community",
    description: "Pick a community that matches your goals or create your own",
    icon: Users,
    color: "emerald",
    details: [
      "Browse communities by category (Education, Micro-savings, Workplace)",
      "Join existing communities or create your own",
      "Set your privacy preferences (% only, no balances shown)",
      "Connect your bank account (read-only via Plaid)"
    ],
    trustNote: "Your bank connection is read-only. We never move money without your approval."
  },
  {
    id: 2,
    title: "Lonniee suggests a challenge & invites members",
    description: "AI suggests personalized challenges and invites community members to participate",
    icon: Target,
    color: "blue",
    details: [
      "Lonniee analyzes community spending patterns",
      "Suggests relevant challenges (Round-Ups, No-Spend, 52-Week)",
      "Invites members via app, WhatsApp, SMS, or call",
      "You choose which challenges to accept"
    ],
    trustNote: "All suggestions are opt-in. You control what challenges you participate in."
  },
  {
    id: 3,
    title: "Members approve, move funds, and Lonniee verifies",
    description: "Progress shows up on the community pod with percent-only aggregation",
    icon: CheckCircle,
    color: "purple",
    details: [
      "You approve each transfer before it happens",
      "Lonniee verifies transfers via Plaid",
      "Progress aggregates in community pods (% only)",
      "Celebrate milestones with your community"
    ],
    trustNote: "Every action is auditable. Balances stay private—only % progress is shared."
  }
]

export function HowItWorksCommunity() {
  const [activeStep, setActiveStep] = useState<number | null>(null)
  const [hoveredStep, setHoveredStep] = useState<number | null>(null)

  return (
    <section id="how-it-works" className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            How it works — 3 simple steps
          </h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Join a community, accept challenges, and watch your progress grow.
          </p>
        </motion.div>
      </div>

      {/* Interactive Step Cards - Connected Flow */}
      <div className="max-w-6xl mx-auto">
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500/30 via-blue-500/30 to-purple-500/30 transform -translate-y-1/2 z-0"></div>
          
          <div className="grid md:grid-cols-3 gap-8 relative z-10">
            {steps.map((step, index) => {
              const IconComponent = step.icon
              const isActive = activeStep === step.id
              const isHovered = hoveredStep === step.id
              
              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative group"
                  onMouseEnter={() => setHoveredStep(step.id)}
                  onMouseLeave={() => setHoveredStep(null)}
                >
                  {/* Step Number Badge */}
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm shadow-lg z-20 border-4 border-black">
                    {step.id}
                  </div>

                  <GlassCard 
                    className={`h-80 p-6 cursor-pointer transition-all duration-300 flex flex-col ${
                      isActive ? 'ring-2 ring-emerald-400/50 bg-white/10' : ''
                    } ${isHovered ? 'scale-105 shadow-lg shadow-emerald-500/20' : ''}`}
                    glow={isActive || isHovered}
                    variant="premium"
                    onClick={() => setActiveStep(isActive ? null : step.id)}
                  >
                    {/* Header - Fixed Height */}
                    <div className="text-center mb-4 flex-shrink-0">
                      <div className={`w-16 h-16 rounded-2xl bg-${step.color}-500/20 flex items-center justify-center mx-auto mb-4 transition-transform duration-300 ${isHovered ? 'scale-110' : ''}`}>
                        <IconComponent className={`h-8 w-8 text-${step.color}-400 transition-transform duration-300 ${isHovered ? 'rotate-12' : ''}`} />
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2 leading-tight">{step.title}</h3>
                      <p className="text-white/70 text-sm leading-relaxed line-clamp-3">{step.description}</p>
                    </div>

                    {/* Expandable Details - Flexible Height */}
                    <div className="flex-1 flex flex-col">
                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="overflow-hidden flex-1"
                          >
                            <div className="space-y-3 pt-4 border-t border-white/10">
                              {step.details.map((detail, detailIndex) => (
                                <motion.div
                                  key={detailIndex}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: detailIndex * 0.1 }}
                                  className="flex items-start gap-3"
                                >
                                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 flex-shrink-0"></div>
                                  <p className="text-white/70 text-sm">{detail}</p>
                                </motion.div>
                              ))}
                              
                              {/* Trust Note */}
                              {step.trustNote && (
                                <motion.div
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.3 }}
                                  className="bg-white/5 rounded-lg p-3 border-l-2 border-emerald-400 mt-4"
                                >
                                  <div className="flex items-start gap-2">
                                    <Shield className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                                    <p className="text-white/80 text-xs">{step.trustNote}</p>
                                  </div>
                                </motion.div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Interactive Toggle - Fixed at Bottom */}
                      <div className="flex justify-center mt-auto pt-4">
                        <div className="flex items-center gap-2 text-xs text-white/60 hover:text-white/80 transition-colors">
                          <span>{isActive ? 'Less' : 'More'}</span>
                          {isActive ? (
                            <ChevronUp className="h-3 w-3" />
                          ) : (
                            <ChevronDown className="h-3 w-3" />
                          )}
                        </div>
                      </div>
                    </div>
                  </GlassCard>

                  {/* Connection Node */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-20">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg border-4 border-black">
                        <ArrowRight className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Compact Trust Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        viewport={{ once: true }}
        className="mt-12"
      >
        <GlassCard className="p-6 text-center" glow variant="premium">
          <div className="max-w-2xl mx-auto space-y-4">
            <h3 className="text-xl font-bold text-white">Built on trust and transparency</h3>
            
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-emerald-400" />
                <span className="text-white/70">Read-only connections</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-blue-400" />
                <span className="text-white/70">Non-custodial</span>
              </div>
              <div className="flex items-center gap-2">
                <EyeOff className="h-4 w-4 text-purple-400" />
                <span className="text-white/70">Privacy by default</span>
              </div>
            </div>

            <p className="text-white/60 text-sm">
              You approve every action. Balances stay private. Only % progress is shared.
            </p>
          </div>
        </GlassCard>
      </motion.div>

      {/* Compact CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        viewport={{ once: true }}
        className="text-center mt-8"
      >
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Button size="lg" asChild className="bg-emerald-600 hover:bg-emerald-700 text-white">
            <Link href="/#communities">
              <Users className="mr-2 h-4 w-4" />
              Join a Community
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="border-white/20 text-white hover:bg-white/5">
            <Link href="/#lonniee">
              <Target className="mr-2 h-4 w-4" />
              Talk to Lonniee
            </Link>
          </Button>
        </div>
      </motion.div>
    </section>
  )
}
