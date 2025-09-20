"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Users, TrendingUp, Target, Zap, GraduationCap, Briefcase, Home, DollarSign } from "lucide-react"
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
    recentActivity: "Sarah saved $200 for textbooks this month!"
  },
  {
    id: "professionals",
    name: "Career Climbers",
    icon: <Briefcase className="h-5 w-5" />,
    members: "5.8k",
    color: "emerald",
    description: "Building wealth while advancing careers",
    challenges: ["Salary Negotiation", "Investment Starter", "Emergency Fund"],
    recentActivity: "Mike increased his savings rate to 25%!"
  },
  {
    id: "families",
    name: "Family Finance",
    icon: <Home className="h-5 w-5" />,
    members: "4.1k",
    color: "purple",
    description: "Managing money for the whole family",
    challenges: ["Kids' College Fund", "Family Vacation", "Home Improvement"],
    recentActivity: "The Johnson family saved $500 for their vacation!"
  },
  {
    id: "side-hustlers",
    name: "Side Hustle Heroes",
    icon: <Zap className="h-5 w-5" />,
    members: "2.7k",
    color: "amber",
    description: "Turning side gigs into main income",
    challenges: ["Freelance Fund", "Business Launch", "Passive Income"],
    recentActivity: "Alex's side hustle now covers all groceries!"
  },
  {
    id: "investors",
    name: "Smart Investors",
    icon: <TrendingUp className="h-5 w-5" />,
    members: "3.9k",
    color: "green",
    description: "Building long-term wealth through investing",
    challenges: ["Index Fund Starter", "Real Estate Fund", "Retirement Boost"],
    recentActivity: "Emma's portfolio grew 12% this quarter!"
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
          <Badge variant="outline" className="mb-4 border-blue-500/30 text-blue-400">
            <Users className="h-4 w-4 mr-2" />
            Diverse Communities
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Find your <span className="text-blue-400">finance tribe</span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Connect with people who share your financial goals and learn from their success stories.
          </p>
        </motion.div>

        {/* Community Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {communityTypes.map((community, index) => (
            <motion.div
              key={community.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <GlassCard 
                className={`p-6 cursor-pointer transition-all duration-300 hover:scale-105 ${
                  activeCommunity === index ? 'ring-2 ring-blue-500/50' : ''
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

                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${getColorClasses(community.color)}`}>
                    {community.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{community.name}</h3>
                    <p className="text-sm text-white/60">{community.members} members</p>
                  </div>
                </div>

                <p className="text-white/70 text-sm mb-4">{community.description}</p>

                <div className="space-y-2 mb-4">
                  {community.challenges.slice(0, 2).map((challenge, i) => (
                    <Badge key={i} variant="outline" className={`text-xs ${getBadgeColor(community.color)}`}>
                      {challenge}
                    </Badge>
                  ))}
                </div>

                <div className="text-xs text-white/50 italic">
                  "{community.recentActivity}"
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Challenge Ripple Visualization */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="relative max-w-4xl mx-auto mb-16"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              Challenges spread like <span className="text-emerald-400">ripples</span>
            </h3>
            <p className="text-white/70">
              When one person succeeds, it inspires others in their community
            </p>
          </div>

          <div className="relative h-64 flex items-center justify-center">
            {/* Central challenge */}
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute z-10 w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center"
            >
              <Target className="h-8 w-8 text-white" />
            </motion.div>

            {/* Ripple circles */}
            {[1, 2, 3, 4].map((ring) => (
              <motion.div
                key={ring}
                className="absolute border-2 border-emerald-400/30 rounded-full"
                style={{
                  width: `${ring * 80}px`,
                  height: `${ring * 80}px`,
                }}
                animate={{
                  scale: [0.8, 1.2, 0.8],
                  opacity: [0.3, 0.1, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: ring * 0.5,
                }}
              />
            ))}

            {/* Community nodes */}
            {communityTypes.map((community, index) => {
              const angle = (index * 360) / communityTypes.length
              const radius = 120
              const x = Math.cos((angle * Math.PI) / 180) * radius
              const y = Math.sin((angle * Math.PI) / 180) * radius

              return (
                <motion.div
                  key={community.id}
                  className="absolute w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center"
                  style={{
                    left: `calc(50% + ${x}px - 16px)`,
                    top: `calc(50% + ${y}px - 16px)`,
                  }}
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.3,
                  }}
                >
                  {community.icon}
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button size="lg" asChild className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg">
            <Link href="/#communities">
              <Users className="mr-2 h-5 w-5" />
              Explore All Communities
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}