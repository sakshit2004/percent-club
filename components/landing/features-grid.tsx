"use client"

import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/ui/glass-card"
import { GlowBadge } from "@/components/ui/glow-badge"
import { 
  CreditCard, 
  Shield, 
  Coins, 
  CheckCircle, 
  TrendingUp,
  ArrowRight 
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

interface Feature {
  id: string
  title: string
  description: string
  icon: React.ComponentType<any>
  color: string
  link: string
  badge?: string
}

const features: Feature[] = [
  {
    id: "subscription-review",
    title: "Subscription Review",
    description: "Detect duplicates, overpriced plans, low-usage subs — one-tap templates to cancel/reschedule.",
    icon: CreditCard,
    color: "emerald",
    link: "/agent#monthly-review",
    badge: "Popular"
  },
  {
    id: "safe-to-save",
    title: "Weekly Safe-to-Save",
    description: "Personalized amounts and scheduled nudges; approval before any ledger entry.",
    icon: Shield,
    color: "blue",
    link: "/agent#safe-save"
  },
  {
    id: "roundups",
    title: "Round-Ups",
    description: "Micro-savings that batch and post when you approve.",
    icon: Coins,
    color: "purple",
    link: "/challenges#roundups"
  },
  {
    id: "deals",
    title: "Deals & Cashbacks",
    description: "Coupons, discounted gift cards, card-linked offers. Redeem → log savings.",
    icon: TrendingUp,
    color: "amber",
    link: "/agent#deals"
  },
  {
    id: "verification",
    title: "Verification & Audit",
    description: "Every action creates a traceable, auditable savings event. Verify transfers via Plaid.",
    icon: CheckCircle,
    color: "emerald",
    link: "/security"
  }
]

export function FeaturesGrid() {
  return (
    <section className="container mx-auto px-4 py-24">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Everything you need to save smarter
        </h2>
        <p className="text-xl text-white/80 max-w-3xl mx-auto">
          Lonniee handles the heavy lifting while you stay in control of every decision.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {features.map((feature, index) => {
          const IconComponent = feature.icon
          return (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={feature.link}>
                <GlassCard className="p-6 h-full cursor-pointer hover:scale-105 transition-transform group" glow>
                  <div className="space-y-4">
                    {/* Icon and Badge */}
                    <div className="flex items-start justify-between">
                      <div className={`p-3 rounded-lg bg-${feature.color}-500/20`}>
                        <IconComponent className={`h-6 w-6 text-${feature.color}-400`} />
                      </div>
                      {feature.badge && (
                        <GlowBadge variant={feature.color as any} size="sm">
                          {feature.badge}
                        </GlowBadge>
                      )}
                    </div>

                    {/* Content */}
                    <div className="space-y-3">
                      <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-white/70 text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>

                    {/* CTA */}
                    <div className="flex items-center text-emerald-400 text-sm font-medium group-hover:text-emerald-300 transition-colors">
                      <span>Learn more</span>
                      <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </GlassCard>
              </Link>
            </motion.div>
          )
        })}
      </div>

      {/* Bottom CTA */}
      <div className="text-center mt-12">
        <Button size="lg" asChild className="bg-emerald-600 hover:bg-emerald-700 text-white">
          <Link href="/agent">
            Try all features with Lonniee
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>
    </section>
  )
}
