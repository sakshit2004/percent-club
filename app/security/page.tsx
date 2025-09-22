"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Shield, Lock, Eye, CheckCircle, Server, Key, Database, UserCheck, ArrowLeft, Users, Bot } from "lucide-react"
import Link from "next/link"
import { GlassCard } from "@/components/ui/glass-card"
import { motion } from "framer-motion"

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
    color: "orange"
  }
]

const trustIndicators = [
  {
    icon: <Server className="h-5 w-5" />,
    title: "SOC 2 Compliant",
    description: "Audited security controls and procedures"
  },
  {
    icon: <Key className="h-5 w-5" />,
    title: "256-bit Encryption",
    description: "Military-grade encryption for all data"
  },
  {
    icon: <Database className="h-5 w-5" />,
    title: "Zero-Knowledge Architecture",
    description: "We can't see your sensitive financial data"
  }
]

const privacyPrinciples = [
  {
    title: "Data Minimization",
    description: "We only collect what's necessary to provide our services",
    icon: <CheckCircle className="h-5 w-5 text-green-500" />
  },
  {
    title: "Transparent Usage",
    description: "Clear explanation of how your data is used",
    icon: <CheckCircle className="h-5 w-5 text-green-500" />
  },
  {
    title: "User Control",
    description: "You can delete your data or disconnect anytime",
    icon: <CheckCircle className="h-5 w-5 text-green-500" />
  },
  {
    title: "No Data Selling",
    description: "We never sell your personal or financial data",
    icon: <CheckCircle className="h-5 w-5 text-green-500" />
  }
]

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-black relative">
      {/* Header */}
      <header className="sticky top-0 z-50">
        <div className="absolute inset-0 bg-black/80 backdrop-blur-xl border-b border-white/10"></div>
        <div className="relative container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img src="/percentclub-logo.svg" alt="percent club logo" width={40} height={40} />
              <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-sm"></div>
            </div>
            <span className="text-xl font-bold text-white tracking-tight">percent club</span>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild className="text-white/80 hover:text-white hover:bg-white/5">
              <Link href="/">← Back to Home</Link>
          </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        {/* Background effects */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-blob-1"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl animate-blob-2"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge variant="outline" className="mb-6 border-blue-500/30 text-blue-400">
              <Shield className="h-4 w-4 mr-2" />
              Security & Privacy
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
              Your financial data is
              <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent"> safe with us</span>
            </h1>
            
            <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto">
              We use bank-level security, read-only access, and never move your money. 
              Your privacy and security are our top priorities.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg">
                <Link href="/#communities">
                  <Users className="mr-2 h-5 w-5" />
                  Join the Community
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 px-8 py-4 text-lg">
                <Link href="/#lonniee">
                  <Bot className="mr-2 h-5 w-5" />
                  Meet Lonniee
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Security Features */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Bank-Level Security
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              We protect your financial data with the same security standards used by major banks and financial institutions.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {securityFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <GlassCard className="h-full">
                  <CardHeader className="text-center">
                    <div className={`w-12 h-12 rounded-full bg-${feature.color}-500/20 flex items-center justify-center mx-auto mb-4`}>
                      <div className={`text-${feature.color}-400`}>
                        {feature.icon}
                      </div>
                    </div>
                    <CardTitle className="text-white text-lg">{feature.title}</CardTitle>
            </CardHeader>
                  <CardContent>
                    <p className="text-white/80 text-center">{feature.description}</p>
            </CardContent>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Trusted by Thousands
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Our security measures are independently verified and trusted by users worldwide.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {trustIndicators.map((indicator, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                  <div className="text-emerald-400">
                    {indicator.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">{indicator.title}</h3>
                <p className="text-white/80">{indicator.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy Principles */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Privacy by Design
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              We believe your financial data should remain private. That's why we built privacy into every aspect of our platform.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {privacyPrinciples.map((principle, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <GlassCard>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      {principle.icon}
                      <div>
                        <h3 className="text-lg font-semibold mb-2 text-white">{principle.title}</h3>
                        <p className="text-white/80">{principle.description}</p>
                      </div>
                    </div>
            </CardContent>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How We Protect You */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              How We Protect You
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Our multi-layered security approach ensures your data is always protected.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <GlassCard>
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                        <Lock className="h-4 w-4 text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2 text-white">Read-Only Access</h3>
                        <p className="text-white/80">We can only view your financial data, never move or modify your money. All transactions require your explicit approval.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                        <Eye className="h-4 w-4 text-emerald-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2 text-white">Encrypted Data</h3>
                        <p className="text-white/80">All your financial data is encrypted in transit and at rest using industry-standard encryption protocols.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                        <Shield className="h-4 w-4 text-purple-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2 text-white">Secure Infrastructure</h3>
                        <p className="text-white/80">Our servers are hosted on secure, SOC 2 compliant infrastructure with regular security audits.</p>
                      </div>
        </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                        <UserCheck className="h-4 w-4 text-orange-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2 text-white">You're in Control</h3>
                        <p className="text-white/80">You can disconnect your bank account, delete your data, or modify your privacy settings at any time.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <GlassCard className="max-w-4xl mx-auto">
              <CardContent className="p-12 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                  Ready to start your secure financial journey?
                </h2>
                <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                  Join thousands of users who trust us with their financial data. 
                  Start with our free community features or get personalized coaching with Lonniee.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" asChild className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg">
                    <Link href="/#communities">
                      <Users className="mr-2 h-5 w-5" />
                      Join the Community
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 px-8 py-4 text-lg">
                    <Link href="/#lonniee">
                      <Bot className="mr-2 h-5 w-5" />
                      Meet Lonniee
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* Trust Strip */}
      <div className="border-t border-white/10 bg-black/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-white/60 text-sm">
            Read-only. We never move money. Disconnect anytime.
          </p>
        </div>
      </div>
    </div>
  )
}