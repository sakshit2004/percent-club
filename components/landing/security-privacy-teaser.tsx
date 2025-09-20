"use client"

import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/ui/glass-card"
import { GlowBadge } from "@/components/ui/glow-badge"
import { Lock, Check, EyeOff, Shield, ArrowRight } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

const securityFeatures = [
  {
    icon: Lock,
    title: "Non-custodial",
    description: "Your money stays in your bank.",
    color: "emerald"
  },
  {
    icon: Check,
    title: "Consent-first",
    description: "You approve every action; nothing moves automatically.",
    color: "blue"
  },
  {
    icon: EyeOff,
    title: "Privacy by default",
    description: "Public shows alias & % only—never balances.",
    color: "purple"
  }
]

export function SecurityPrivacyTeaser() {
  return (
    <section id="security" className="container mx-auto px-4 py-16 scroll-mt-24">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Security & Privacy
        </h2>
        <p className="text-lg text-white/80 max-w-2xl mx-auto">
          Your financial data is protected with enterprise-grade security.
        </p>
      </div>

      {/* Security Features Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {securityFeatures.map((feature, index) => {
          const IconComponent = feature.icon
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard className="p-6 text-center h-full" glow variant="premium">
                <div className={`w-16 h-16 rounded-full bg-${feature.color}-500/20 flex items-center justify-center mx-auto mb-6`}>
                  <IconComponent className={`h-8 w-8 text-${feature.color}-400`} />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-white/70">{feature.description}</p>
              </GlassCard>
            </motion.div>
          )
        })}
      </div>

      {/* Trust Badges */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        <GlowBadge variant="emerald" className="text-sm">
          <Shield className="h-4 w-4 mr-2" />
          Read-only connections
        </GlowBadge>
        <GlowBadge variant="blue" className="text-sm">
          <Lock className="h-4 w-4 mr-2" />
          Encrypted at rest
        </GlowBadge>
        <GlowBadge variant="purple" className="text-sm">
          <EyeOff className="h-4 w-4 mr-2" />
          Privacy by design
        </GlowBadge>
      </div>


      {/* CTA Section */}
      <div className="text-center">
        <p className="text-white/60 mb-6 max-w-xl mx-auto text-sm">
          Read-only connection via trusted providers. Export & delete your data anytime.
        </p>
        <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white">
          <Link href="/onboarding">
            Get Started Securely
          </Link>
        </Button>
      </div>
    </section>
  )
}
