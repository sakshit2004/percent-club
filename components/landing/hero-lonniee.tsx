"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Bot, Sparkles, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/ui/glass-card"
import { GlowBadge } from "@/components/ui/glow-badge"

const communityFeatures = [
  "Diverse finance communities",
  "Collaborative challenges",
  "Peer support & motivation",
  "Shared success stories",
]

const communityStats = [
  "15.2k active members",
  "2.1M challenges completed",
  "$58k community savings",
]


export function HeroLonniee() {
  const [currentStatIndex, setCurrentStatIndex] = useState(0)

  useEffect(() => {
    const statInterval = setInterval(() => {
      setCurrentStatIndex((prevIndex) => (prevIndex + 1) % communityStats.length)
    }, 3000)
    
    return () => {
      clearInterval(statInterval)
    }
  }, [])


  return (
    <section id="hero" className="relative overflow-hidden py-20 md:py-32 min-h-[85vh] flex items-center">
      {/* Background gradient effect */}
      <div className="absolute inset-0 z-0 opacity-30">
        <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-emerald-500/10 rounded-full blur-3xl animate-blob-1"></div>
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-blue-500/10 rounded-full blur-3xl animate-blob-2"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8 text-center max-w-4xl mx-auto"
        >
          <div>
            <GlowBadge className="mb-6" variant="blue">
              <Users className="h-4 w-4 mr-2" />
              Community-first finance
            </GlowBadge>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Finance is <span className="text-blue-400">better together</span>
            </h1>

            <p className="text-xl md:text-2xl text-white/80 mb-8 leading-relaxed">
              Join vibrant communities, conquer challenges, and let Lonniee be your personal finance conductor.
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            {communityFeatures.map((feature, index) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-2 text-sm text-white/70"
              >
                <Sparkles className="h-4 w-4 text-blue-400" />
                <span>{feature}</span>
              </motion.div>
            ))}
          </div>

          {/* Community stats */}
          <div className="flex items-center gap-4 text-sm text-white/60 justify-center">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span>Community impact:</span>
            </div>
            <AnimatePresence mode="wait">
              <motion.span
                key={currentStatIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-blue-400 font-medium"
              >
                {communityStats[currentStatIndex]}
              </motion.span>
            </AnimatePresence>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg">
              <Link href="/#communities">
                <Users className="mr-2 h-5 w-5" />
                Join the Community
                <ArrowRight className="ml-2 h-5 w-5" />
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
  )
}
