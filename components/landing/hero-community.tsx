"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/ui/glass-card"
import { GlowBadge } from "@/components/ui/glow-badge"
import { ArrowRight, Users, TrendingUp, Target, Sparkles } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

interface LeaderboardUser {
  alias: string
  progress: number
  avatar: string
  level: number
}

interface CommunityPost {
  id: string
  alias: string
  content: string
  progress: number
  timestamp: number
}

const leaderboardUsers: LeaderboardUser[] = [
  { alias: "@ace", progress: 95, avatar: "A", level: 8 },
  { alias: "@saver", progress: 82, avatar: "S", level: 7 },
  { alias: "@nova", progress: 76, avatar: "N", level: 6 },
  { alias: "@thrifty", progress: 68, avatar: "T", level: 5 },
  { alias: "@wise", progress: 61, avatar: "W", level: 4 }
]

const communityPosts: CommunityPost[] = [
  { id: "1", alias: "@ace", content: "Just hit 95% on my emergency fund! 🎉", progress: 95, timestamp: Date.now() - 1000 },
  { id: "2", alias: "@saver", content: "Week 12 of 52-week challenge complete", progress: 82, timestamp: Date.now() - 2000 },
  { id: "3", alias: "@nova", content: "Found $40 in subscription savings this month", progress: 76, timestamp: Date.now() - 3000 }
]

const socialProofStats = [
  "12.4k members",
  "1.8M micro-saves logged", 
  "$42k planned monthly savings"
]

export function HeroCommunity() {
  const [currentStatIndex, setCurrentStatIndex] = useState(0)
  const [currentPostIndex, setCurrentPostIndex] = useState(0)

  // Rotate social proof stats
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStatIndex(prev => (prev + 1) % socialProofStats.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  // Rotate community posts
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPostIndex(prev => (prev + 1) % communityPosts.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-blue-500/5"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Community-first messaging */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div>
              <GlowBadge className="mb-6" variant="emerald">
                <Users className="h-4 w-4 mr-2" />
                thriving community
              </GlowBadge>
              
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                Join thousands <span className="text-emerald-400">saving together</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-white/80 mb-8 leading-relaxed">
                Communities, leaderboards, and shared challenges—small, verified wins you can actually achieve.
              </p>
            </div>

            {/* Social proof strip */}
            <div className="flex items-center gap-4 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span>Live stats:</span>
              </div>
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentStatIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-emerald-400 font-medium"
                >
                  {socialProofStats[currentStatIndex]}
                </motion.span>
              </AnimatePresence>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 text-lg">
                <Link href="/communities">
                  Explore Communities
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-white/20 text-white hover:bg-white/5 px-8 py-4 text-lg">
                <Link href="/agent">Talk to Lonniee</Link>
              </Button>
            </div>
          </motion.div>

          {/* Right: Leaderboard + Community Feed */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Meta-Inspired Innovation Leaderboard */}
            <div className="relative">
              {/* Floating background elements */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-blue-500/5 rounded-2xl"></div>
              <div className="absolute top-4 right-4 w-20 h-20 bg-emerald-500/10 rounded-full blur-xl"></div>
              <div className="absolute bottom-4 left-4 w-16 h-16 bg-blue-500/10 rounded-full blur-lg"></div>
              
              <GlassCard className="relative p-6 overflow-hidden" glow variant="premium">
                {/* Innovative header with data visualization */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                        <TrendingUp className="h-4 w-4 text-white" />
                      </div>
                      {/* Micro-animation indicator */}
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-ping"></div>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Savings Momentum</h3>
                      <p className="text-xs text-white/60">Community progress this week</p>
                    </div>
                  </div>
                  
                  {/* Live stats micro-widget */}
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-xs text-white/50">Active</div>
                      <div className="text-sm font-bold text-emerald-400">2.1k</div>
                    </div>
                    <div className="w-px h-8 bg-white/10"></div>
                    <div className="text-right">
                      <div className="text-xs text-white/50">Avg</div>
                      <div className="text-sm font-bold text-blue-400">+12%</div>
                    </div>
                  </div>
                </div>
                
                {/* Revolutionary circular progress visualization */}
                <div className="relative mb-6">
                  <div className="flex items-center justify-center">
                    <div className="relative w-32 h-32">
                      {/* Background circle */}
                      <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke="rgba(255,255,255,0.1)"
                          strokeWidth="8"
                          fill="none"
                        />
                        {/* Animated progress arc */}
                        <motion.circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke="url(#gradient)"
                          strokeWidth="8"
                          fill="none"
                          strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 40}`}
                          initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                          animate={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - 0.78) }}
                          transition={{ duration: 2, ease: "easeOut" }}
                        />
                        <defs>
                          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#10b981" />
                            <stop offset="100%" stopColor="#06b6d4" />
                          </linearGradient>
                        </defs>
                      </svg>
                      
                      {/* Center content */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="text-2xl font-bold text-white">78%</div>
                        <div className="text-xs text-white/60">Community Avg</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Innovative user cards with depth */}
                <div className="space-y-3">
                  {leaderboardUsers.slice(0, 3).map((user, index) => (
                    <motion.div
                      key={user.alias}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
                      className="group relative"
                    >
                      {/* Card with innovative layering */}
                      <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:border-emerald-400/30 transition-all duration-300 group-hover:bg-white/10 group-hover:shadow-lg group-hover:shadow-emerald-500/10">
                        {/* Floating rank badge */}
                        <div className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-xs shadow-lg">
                          {index + 1}
                        </div>
                        
                        <div className="flex items-center gap-4">
                          {/* Innovative avatar with status ring */}
                          <div className="relative">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                              {user.avatar}
                            </div>
                            {/* Status ring */}
                            <div className="absolute inset-0 rounded-xl border-2 border-emerald-400/50 animate-pulse"></div>
                          </div>
                          
                          {/* User info with innovative typography */}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-white font-semibold text-sm">{user.alias}</span>
                              <div className="px-2 py-0.5 bg-emerald-500/20 rounded-full">
                                <span className="text-emerald-400 text-xs font-medium">L{user.level}</span>
                              </div>
                            </div>
                            
                            {/* Innovative progress visualization */}
                            <div className="flex items-center gap-3">
                              <div className="flex-1 relative">
                                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                  <motion.div 
                                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full relative"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${user.progress}%` }}
                                    transition={{ delay: index * 0.1 + 0.5, duration: 1.2, ease: "easeOut" }}
                                  >
                                    {/* Shimmer effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                  </motion.div>
                                </div>
                              </div>
                              <span className="text-emerald-400 font-bold text-sm w-10 text-right">{user.progress}%</span>
                            </div>
                          </div>
                          
                          {/* Achievement micro-badge */}
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center">
                            <span className="text-emerald-400 text-lg">
                              {index === 0 ? "🏆" : index === 1 ? "🥈" : "🥉"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                {/* Innovative footer with micro-interactions */}
                <div className="mt-6 pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                      <span className="text-xs text-white/60">Live from 12.4k members</span>
                    </div>
                    <Link 
                      href="/communities" 
                      className="group flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                      <span>Explore community</span>
                      <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* Community Feed Snippet */}
            <GlassCard className="p-4" glow>
              <div className="flex items-center gap-2 mb-4">
                <Users className="h-4 w-4 text-emerald-400" />
                <h4 className="text-sm font-semibold text-white">Community Updates</h4>
              </div>
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPostIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-3"
                >
                  {communityPosts.slice(currentPostIndex, currentPostIndex + 2).map((post) => (
                    <div key={post.id} className="bg-white/5 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-xs font-bold text-emerald-400">
                          {post.alias[1]}
                        </div>
                        <span className="text-white text-sm font-medium">{post.alias}</span>
                        <GlowBadge variant="emerald" size="sm">{post.progress}%</GlowBadge>
                      </div>
                      <p className="text-white/70 text-sm">{post.content}</p>
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
