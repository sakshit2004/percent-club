"use client"

import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/ui/glass-card"
import { GlowBadge } from "@/components/ui/glow-badge"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, TrendingUp, Target, ArrowRight, Heart, MessageSquare } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

interface Creator {
  id: string
  alias: string
  handle: string
  avatar: string
  level: number
  followersCount: number
  featuredPodProgress: number
  featuredPodName: string
  recentPost: string
  badges: string[]
  isVerified: boolean
}

const creators: Creator[] = [
  {
    id: "1",
    alias: "Alex Chen",
    handle: "ace",
    avatar: "A",
    level: 8,
    followersCount: 1240,
    featuredPodProgress: 95,
    featuredPodName: "Emergency Fund",
    recentPost: "Just hit 95% on my emergency fund! The community challenges really helped me stay consistent. 🎉",
    badges: ["Early Adopter", "Challenge Master"],
    isVerified: true
  },
  {
    id: "2",
    alias: "Sarah Kim",
    handle: "saver",
    avatar: "S",
    level: 7,
    followersCount: 890,
    featuredPodProgress: 82,
    featuredPodName: "Vacation Fund",
    recentPost: "Week 12 of the 52-week challenge complete! Loving the accountability from my community.",
    badges: ["Round-Up Pro", "Community Leader"],
    isVerified: true
  },
  {
    id: "3",
    alias: "Marcus Johnson",
    handle: "nova",
    avatar: "M",
    level: 6,
    followersCount: 650,
    featuredPodProgress: 76,
    featuredPodName: "Home Down Payment",
    recentPost: "Found $40 in subscription savings this month thanks to Lonniee's suggestions. Every dollar counts!",
    badges: ["Deal Hunter", "Micro-Saver"],
    isVerified: false
  },
  {
    id: "4",
    alias: "Emma Rodriguez",
    handle: "thrifty",
    avatar: "E",
    level: 5,
    followersCount: 420,
    featuredPodProgress: 68,
    featuredPodName: "Student Loan Payoff",
    recentPost: "The community's support during my no-spend challenge was incredible. We're all in this together! 💪",
    badges: ["No-Spend Champion", "Motivator"],
    isVerified: false
  }
]

export function ProfilesCreators() {
  return (
    <section id="profiles" className="container mx-auto px-4 py-24">
      <div className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Profiles & Creators — motivation without exposure
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Follow creators you trust. Share tips and % progress—balances stay private.
          </p>
        </motion.div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {creators.map((creator, index) => (
          <motion.div
            key={creator.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <GlassCard className="p-6 h-full cursor-pointer hover:scale-105 transition-transform group" glow>
              <div className="space-y-4">
                {/* Profile Header */}
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-bold">
                      {creator.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-white text-sm group-hover:text-emerald-400 transition-colors">
                        {creator.alias}
                      </h3>
                      {creator.isVerified && (
                        <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </div>
                    <p className="text-white/60 text-xs">@{creator.handle}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <GlowBadge variant="emerald" size="sm">L{creator.level}</GlowBadge>
                      <div className="flex items-center gap-1 text-xs text-white/60">
                        <Users className="h-3 w-3" />
                        <span>{creator.followersCount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Featured Pod Progress */}
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white text-sm font-medium">{creator.featuredPodName}</span>
                    <span className="text-emerald-400 text-sm font-semibold">{creator.featuredPodProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-1000"
                      style={{ width: `${creator.featuredPodProgress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Recent Post */}
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-white/70 text-xs leading-relaxed line-clamp-3">
                    {creator.recentPost}
                  </p>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-1">
                  {creator.badges.map((badge) => (
                    <Badge key={badge} variant="outline" className="text-xs border-white/20 text-white/70">
                      {badge}
                    </Badge>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2 border-t border-white/10">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1 border-white/20 text-white hover:bg-white/5 text-xs"
                    asChild
                  >
                    <Link href={`/profile/${creator.handle}`}>
                      <Heart className="h-3 w-3 mr-1" />
                      Follow
                    </Link>
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1 border-white/20 text-white hover:bg-white/5 text-xs"
                    asChild
                  >
                    <Link href={`/profile/${creator.handle}`}>
                      <MessageSquare className="h-3 w-3 mr-1" />
                      View
                    </Link>
                  </Button>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        viewport={{ once: true }}
        className="text-center mt-12"
      >
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button size="lg" asChild className="bg-emerald-600 hover:bg-emerald-700 text-white">
            <Link href="/feed">
              <MessageSquare className="mr-2 h-5 w-5" />
              See Community Posts
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="border-white/20 text-white hover:bg-white/5">
            <Link href="/communities">
              <Users className="mr-2 h-5 w-5" />
              Explore Communities
            </Link>
          </Button>
        </div>
      </motion.div>
    </section>
  )
}
