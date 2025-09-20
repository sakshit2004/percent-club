"use client"

import { motion } from "framer-motion"
import { Shield, Lock, Eye, CheckCircle, Server, Key, Database, UserCheck } from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"
import { Badge } from "@/components/ui/badge"

const securityFeatures = [
  {
    icon: <Lock className="h-6 w-6" />,
    title: "End-to-End Encryption",
    description: "All your financial data is encrypted in transit and at rest",
    color: "blue"
  },
  {
    icon: <Eye className="h-6 w-6" />,
    title: "Read-Only Access",
    description: "We can only view your data, never move or modify your money",
    color: "emerald"
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Bank-Level Security",
    description: "Same security standards used by major financial institutions",
    color: "purple"
  },
  {
    icon: <UserCheck className="h-6 w-6" />,
    title: "Consent-First",
    description: "You approve every action before it happens",
    color: "amber"
  },
  {
    icon: <Server className="h-6 w-6" />,
    title: "Non-Custodial",
    description: "Your money stays in your bank, we never hold it",
    color: "green"
  },
  {
    icon: <Key className="h-6 w-6" />,
    title: "Disconnect Anytime",
    description: "Revoke access instantly with a single click",
    color: "red"
  }
]

const trustIndicators = [
  { text: "SOC 2 Type II Compliant", icon: <CheckCircle className="h-4 w-4" /> },
  { text: "256-bit SSL Encryption", icon: <CheckCircle className="h-4 w-4" /> },
  { text: "Regular Security Audits", icon: <CheckCircle className="h-4 w-4" /> },
  { text: "GDPR Compliant", icon: <CheckCircle className="h-4 w-4" /> },
]

export function SecurityPrivacy() {
  const getColorClasses = (color: string) => {
    const colors = {
      blue: "from-blue-500/20 to-blue-600/20 border-blue-500/30",
      emerald: "from-emerald-500/20 to-emerald-600/20 border-emerald-500/30",
      purple: "from-purple-500/20 to-purple-600/20 border-purple-500/30",
      amber: "from-amber-500/20 to-amber-600/20 border-amber-500/30",
      green: "from-green-500/20 to-green-600/20 border-green-500/30",
      red: "from-red-500/20 to-red-600/20 border-red-500/30",
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  return (
    <section id="security" className="py-20 md:py-32 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-blob-1"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl animate-blob-2"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4 border-emerald-500/30 text-emerald-400">
            <Shield className="h-4 w-4 mr-2" />
            Security & Privacy
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Your <span className="text-emerald-400">privacy</span> is our priority
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            We use bank-level security to protect your data while keeping you in complete control of your finances.
          </p>
        </motion.div>

        {/* Security Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {securityFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <GlassCard className="p-6 h-full" glow>
                <div className={`p-4 rounded-xl bg-gradient-to-br ${getColorClasses(feature.color)} mb-4 w-fit`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-white/70 text-sm">{feature.description}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-white/5 rounded-2xl p-8 border border-white/10"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              Trusted by thousands of users
            </h3>
            <p className="text-white/70">
              We maintain the highest standards of security and compliance
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustIndicators.map((indicator, index) => (
              <motion.div
                key={indicator.text}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10"
              >
                <div className="p-2 rounded-lg bg-emerald-500/20">
                  {indicator.icon}
                </div>
                <span className="text-white font-medium text-sm">{indicator.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500/10 rounded-full border border-emerald-500/20">
            <Database className="h-5 w-5 text-emerald-400" />
            <span className="text-emerald-400 font-medium">
              Your data never leaves your control
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
