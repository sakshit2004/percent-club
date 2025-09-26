"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Users, TrendingUp, Target, Zap, GraduationCap, Briefcase, Home, ArrowRight, Sparkles, Star, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/ui/glass-card"
import { Badge } from "@/components/ui/badge"


const communityTypes = [
  {
    id: "students",
    name: "Student Savers",
    icon: <GraduationCap className="h-5 w-5" />,
    members: "3.2k",
    color: "blue",
    description: "Budget-friendly tips for college life",
    challenges: ["Coffee to Books", "No-Spend Weekends", "Side Hustle Fund"],
    recentActivity: "Sarah saved $200 for textbooks this month!",
    successRate: "94%",
    avgSavings: "$180/mo"
  },
  {
    id: "professionals",
    name: "Career Climbers",
    icon: <Briefcase className="h-5 w-5" />,
    members: "5.8k",
    color: "emerald",
    description: "Building wealth while advancing careers",
    challenges: ["Salary Negotiation", "Investment Starter", "Emergency Fund"],
    recentActivity: "Mike increased his savings rate to 25%!",
    successRate: "89%",
    avgSavings: "$1,200/mo"
  },
  {
    id: "families",
    name: "Family Finance",
    icon: <Home className="h-5 w-5" />,
    members: "4.1k",
    color: "purple",
    description: "Managing money for the whole family",
    challenges: ["Kids' College Fund", "Family Vacation", "Home Improvement"],
    recentActivity: "The Johnson family saved $500 for their vacation!",
    successRate: "91%",
    avgSavings: "$850/mo"
  },
  {
    id: "side-hustlers",
    name: "Side Hustle Heroes",
    icon: <Zap className="h-5 w-5" />,
    members: "2.7k",
    color: "amber",
    description: "Turning side gigs into main income",
    challenges: ["Freelance Fund", "Business Launch", "Passive Income"],
    recentActivity: "Alex's side hustle now covers all groceries!",
    successRate: "87%",
    avgSavings: "$650/mo"
  },
  {
    id: "investors",
    name: "Smart Investors",
    icon: <TrendingUp className="h-5 w-5" />,
    members: "3.9k",
    color: "green",
    description: "Building long-term wealth through investing",
    challenges: ["Index Fund Starter", "Real Estate Fund", "Retirement Boost"],
    recentActivity: "Emma's portfolio grew 12% this quarter!",
    successRate: "96%",
    avgSavings: "$2,100/mo"
  }
]


const rippleEffect = [
  { delay: 0, scale: 1, opacity: 0.8 },
  { delay: 0.5, scale: 1.2, opacity: 0.6 },
  { delay: 1, scale: 1.4, opacity: 0.4 },
  { delay: 1.5, scale: 1.6, opacity: 0.2 },
]

export function CommunitySpotlight() {
  const [activeCommunity, setActiveCommunity] = useState(0)
  const [showRipple, setShowRipple] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCommunity((prev) => (prev + 1) % communityTypes.length)
      setShowRipple(true)
      setTimeout(() => setShowRipple(false), 2000)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "from-blue-500/20 to-blue-600/20 border-blue-500/30",
      emerald: "from-emerald-500/20 to-emerald-600/20 border-emerald-500/30",
      purple: "from-purple-500/20 to-purple-600/20 border-purple-500/30",
      amber: "from-amber-500/20 to-amber-600/20 border-amber-500/30",
      green: "from-green-500/20 to-green-600/20 border-green-500/30",
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  const getBadgeColor = (color: string) => {
    const colors = {
      blue: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      emerald: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      purple: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      amber: "bg-amber-500/20 text-amber-400 border-amber-500/30",
      green: "bg-green-500/20 text-green-400 border-green-500/30",
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  return (
    <section id="communities" className="py-20 md:py-32 relative overflow-hidden">
      {/* Enhanced Background effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-blob-1"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-blob-2"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/5 rounded-full blur-2xl animate-pulse"></div>
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
          <Badge variant="outline" className="mb-6 border-blue-500/30 text-blue-400 bg-blue-500/10">
            <Sparkles className="h-4 w-4 mr-2" />
            Diverse Communities
          </Badge>
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Find your <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">finance tribe</span>
          </h2>
          <p className="text-xl md:text-2xl text-white/80 max-w-4xl mx-auto leading-relaxed">
            Connect with people who share your financial goals and learn from their success stories.
          </p>
        </motion.div>

        {/* Community Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {communityTypes.map((community, index) => (
            <motion.div
              key={community.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <GlassCard 
                className={`p-8 cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-2xl ${
                  activeCommunity === index ? 'ring-2 ring-blue-500/50 shadow-blue-500/20' : ''
                }`}
                glow={activeCommunity === index}
              >
                {/* Ripple Effect */}
                {showRipple && activeCommunity === index && (
                  <div className="absolute inset-0 pointer-events-none">
                    {rippleEffect.map((ripple, i) => (
                      <motion.div
                        key={i}
                        className="absolute top-1/2 left-1/2 w-4 h-4 bg-blue-400 rounded-full"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ 
                          scale: ripple.scale, 
                          opacity: ripple.opacity,
                          x: -8,
                          y: -8
                        }}
                        transition={{ 
                          duration: 2,
                          delay: ripple.delay,
                          ease: "easeOut"
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* Header with icon and stats */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${getColorClasses(community.color)} shadow-lg`}>
                      {community.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">{community.name}</h3>
                      <p className="text-sm text-white/60">{community.members} members</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-emerald-400">{community.successRate}</div>
                    <div className="text-xs text-white/50">success rate</div>
                  </div>
                </div>

                <p className="text-white/80 text-base mb-6 leading-relaxed">{community.description}</p>

                {/* Success metrics */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span className="text-sm text-white/70">Avg. savings:</span>
                    <span className="text-sm font-semibold text-emerald-400">{community.avgSavings}</span>
                  </div>
                </div>

                {/* Challenge badges */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {community.challenges.slice(0, 2).map((challenge, i) => (
                    <Badge key={i} variant="outline" className={`text-xs px-3 py-1 ${getBadgeColor(community.color)}`}>
                      {challenge}
                    </Badge>
                  ))}
                </div>

                {/* Recent activity */}
                <div className="bg-white/5 rounded-lg p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <MessageCircle className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-sm text-white/90 italic mb-1">"{community.recentActivity}"</div>
                      <div className="text-xs text-white/50">Recent success story</div>
                    </div>
                  </div>
                </div>

                {/* Join button */}
                <Button 
                  variant="outline" 
                  className={`w-full border-2 ${getBadgeColor(community.color)} hover:scale-105 transition-all duration-300`}
                >
                  Join Community
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </GlassCard>
            </motion.div>
          ))}
        </div>



      </div>
    </section>
  )
}