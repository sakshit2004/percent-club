"use client"

import { Button } from "@/components/ui/button"
import { GlowBadge } from "@/components/ui/glow-badge"
import { FloatingChip } from "@/components/ui/floating-chip"
import { ArrowRight, Sparkles, MessageSquare, Phone, Smartphone } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"

export function Hero() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-blue-500/5"></div>
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <GlowBadge className="mb-8" variant="emerald">
            <Sparkles className="h-4 w-4 mr-2" />
            crafted for the creditworthy
          </GlowBadge>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Meet <span className="text-emerald-400">Lonniee</span> — your AI savings expert
          </h1>
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl md:text-2xl text-white/80 mb-12 max-w-4xl mx-auto leading-relaxed"
        >
          Lonniee finds waste, proposes safe weekly saves, batches round-ups, and hunts better deals — 
          and reaches you wherever you already chat: app, WhatsApp, SMS or phone.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
        >
          <Button size="lg" asChild className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 text-lg">
            <Link href="/agent">
              Get started — Talk to Lonniee
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="border-white/20 text-white hover:bg-white/5 px-8 py-4 text-lg">
            <Link href="#how-it-works">How it works</Link>
          </Button>
        </motion.div>

        {/* Device mock with floating chips */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="relative max-w-md mx-auto"
        >
          {/* Device mockup */}
          <div className="relative bg-black/20 backdrop-blur-sm rounded-3xl p-4 border border-white/10">
            <div className="bg-white/5 rounded-2xl p-6 min-h-[400px] flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
                <Image src="/Looniee-logo-main.svg" alt="Lonniee AI" width={32} height={32} className="w-8 h-8 object-contain" />
              </div>
              <h3 className="text-white font-semibold mb-2">Lonniee AI</h3>
              <p className="text-white/60 text-sm text-center">Your personal finance expert</p>
            </div>
          </div>

          {/* Floating chips */}
          <FloatingChip
            className="absolute -top-4 -left-4"
            delay={1.2}
            icon={MessageSquare}
            text="Cancel duplicate"
            variant="emerald"
          />
          <FloatingChip
            className="absolute -top-2 -right-8"
            delay={1.4}
            icon={Sparkles}
            text="Post Round-Ups"
            variant="blue"
          />
          <FloatingChip
            className="absolute -bottom-4 -left-2"
            delay={1.6}
            icon={Phone}
            text="Safe-to-Save"
            variant="purple"
          />
        </motion.div>
      </div>
    </section>
  )
}
