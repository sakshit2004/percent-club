"use client"

import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/ui/glass-card"
import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export function CtaBand() {
  return (
    <section className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <GlassCard className="p-8 text-center" glow variant="premium">
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Content */}
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Ready to start saving smarter?
              </h2>
              <p className="text-lg text-white/80 max-w-xl mx-auto">
                Join thousands who trust Lonniee to help them reach their financial goals.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" asChild className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 text-lg">
                <Link href="/#lonniee">
                  Start with Lonniee
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10 px-8 py-4 text-lg">
                <Link href="/#communities">Browse Communities</Link>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="pt-6 border-t border-white/10">
              <div className="flex flex-wrap justify-center gap-4 text-sm text-white/60">
                <span>Free to start</span>
                <span>•</span>
                <span>No credit card required</span>
                <span>•</span>
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </section>
  )
}
