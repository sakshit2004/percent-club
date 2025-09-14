import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Coins,
  Target,
  Bot,
  ArrowRight,
  Menu,
  Calendar,
  TrendingUp,
  Lock,
  Shield,
  EyeOff,
  Medal,
  Trophy,
  MessageSquare,
  Check,
  X,
  Sparkles,
  Zap,
  Users,
  CreditCard,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { PodProgressRing } from "@/components/pods/pod-progress-ring"
import { CursorEffect } from "@/components/common/cursor-effect"
import { GlassCard } from "@/components/ui/glass-card"
import { GlowBadge } from "@/components/ui/glow-badge"
import { ApprovalPreview } from "@/components/ui/approval-preview"
import { FloatingChip } from "@/components/ui/floating-chip"
import { AnimatedTagline } from "@/components/ui/animated-tagline"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black relative">
      <CursorEffect />
      {/* Header */}
      <header className="sticky top-0 z-50">
        <div className="absolute inset-0 bg-black/80 backdrop-blur-xl border-b border-white/10"></div>
        <div className="relative container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Image src="/percentclub-logo.svg" alt="percent club logo" width={40} height={40} priority />
              <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-sm"></div>
            </div>
            <span className="text-xl font-bold text-white tracking-tight">percent club</span>
          </div>
          
          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/5 px-3">
                  What We Offer
                  <ArrowRight className="ml-1 h-3 w-3 rotate-90" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[600px] p-6 bg-black/90 backdrop-blur-xl border-white/10">
                <div className="grid grid-cols-2 gap-6 text-left">
                  <Link href="/#pods" className="group rounded-lg p-4 hover:bg-white/5 transition-colors">
                    <div className="font-semibold text-white group-hover:text-emerald-400 transition-colors">Pods & Challenges</div>
                    <div className="text-xs text-white/60 mt-1">One engine for progress. Set goals, feed them with verified savings.</div>
                  </Link>
                  <Link href="/#lonniee" className="group rounded-lg p-4 hover:bg-white/5 transition-colors">
                    <div className="font-semibold text-white group-hover:text-emerald-400 transition-colors">Lonniee</div>
                    <div className="text-xs text-white/60 mt-1">Your personal finance expert that kills waste and finds deals.</div>
                  </Link>
                  <Link href="/#communities" className="group rounded-lg p-4 hover:bg-white/5 transition-colors">
                    <div className="font-semibold text-white group-hover:text-emerald-400 transition-colors">Communities</div>
                    <div className="text-xs text-white/60 mt-1">Badges, levels, leaderboards—normalized by % only.</div>
                  </Link>
                  <Link href="/#security" className="group rounded-lg p-4 hover:bg-white/5 transition-colors">
                    <div className="font-semibold text-white group-hover:text-emerald-400 transition-colors">Security & Privacy</div>
                    <div className="text-xs text-white/60 mt-1">Non-custodial. Consent-first. Privacy by default.</div>
                  </Link>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link href="/how-it-works" className="text-sm text-white/80 hover:text-white transition-colors">How It Works</Link>
            <Link href="/pricing" className="text-sm text-white/80 hover:text-white transition-colors">Pricing</Link>
            <Link href="/about" className="text-sm text-white/80 hover:text-white transition-colors">About</Link>
          </div>

          {/* Mobile: hamburger menu */}
          <div className="md:hidden">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu" className="text-white">
                  <Menu className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="p-0 max-w-sm bg-black/95 backdrop-blur-xl border-white/10">
                <div className="p-4 space-y-2">
                  <Link href="/#pods" className="block px-3 py-2 rounded-md hover:bg-white/5 text-white">What We Offer</Link>
                  <Link href="/how-it-works" className="block px-3 py-2 rounded-md hover:bg-white/5 text-white">How It Works</Link>
                  <Link href="/pricing" className="block px-3 py-2 rounded-md hover:bg-white/5 text-white">Pricing</Link>
                  <Link href="/about" className="block px-3 py-2 rounded-md hover:bg-white/5 text-white">About</Link>
                </div>
                <div className="sticky bottom-0 p-4 border-t border-white/10">
                  <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-700">
                    <Link href="/onboarding">Get Started</Link>
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Right actions (desktop) */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" asChild className="text-white/80 hover:text-white hover:bg-white/5">
              <Link href="/auth/login">Sign In</Link>
            </Button>
            <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <Link href="/onboarding">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center">
        <div className="container mx-auto px-4 text-center relative z-10">
          <GlowBadge className="mb-8" variant="emerald">
            <Sparkles className="h-4 w-4 mr-2" />
            crafted for the creditworthy
          </GlowBadge>
          
          <AnimatedTagline className="mb-8" />
          
          <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed">
            Your personal finance expert that kills waste, proposes safe weekly saves, 
            batches round-ups, and finds better deals—non-custodial and consent-first.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" asChild className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 text-lg">
              <Link href="/onboarding">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-white/20 text-white hover:bg-white/5 px-8 py-4 text-lg">
              <Link href="/#pods">See how it works</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Pods × Challenges Section */}
      <section id="pods" className="container mx-auto px-4 py-24 scroll-mt-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Explainer + Toggles */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Pods & Challenges—one engine
              </h2>
              <p className="text-xl text-white/80 mb-6">
                Pods are your goal buckets. Challenges are behaviors feeding them.
              </p>
              <p className="text-white/60">
                Choose a sink pod. Money stays in your bank—we track verified saves.
              </p>
            </div>

            {/* Challenge Toggles */}
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <GlowBadge variant="emerald" className="cursor-pointer hover:scale-105 transition-transform">
                  Round-Ups
                </GlowBadge>
                <GlowBadge variant="blue" className="cursor-pointer hover:scale-105 transition-transform">
                  Weekly Auto-Save
                </GlowBadge>
                <GlowBadge variant="purple" className="cursor-pointer hover:scale-105 transition-transform">
                  52-Week
                </GlowBadge>
              </div>
              
              <div className="space-y-3 text-sm text-white/70">
                <p>• <span className="text-emerald-400">Posts when ≥ $5</span> on Round-Ups</p>
                <p>• <span className="text-blue-400">Approve each save</span> on Weekly Auto-Save</p>
                <p>• <span className="text-purple-400">Steady momentum</span> on 52-Week</p>
              </div>
            </div>

            <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <Link href="/onboarding">Start your first Pod</Link>
            </Button>
          </div>

          {/* Right: Animated Visualization */}
          <div className="relative">
            {/* Challenge Cards */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <GlassCard className="p-4 text-center" glow>
                <Coins className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
                <h4 className="font-semibold text-white text-sm">Round-Ups</h4>
                <p className="text-xs text-white/60 mt-1">$4.23 → $5.00</p>
              </GlassCard>
              <GlassCard className="p-4 text-center" glow>
                <Calendar className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                <h4 className="font-semibold text-white text-sm">Weekly</h4>
                <p className="text-xs text-white/60 mt-1">$25/week</p>
              </GlassCard>
              <GlassCard className="p-4 text-center" glow>
                <TrendingUp className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                <h4 className="font-semibold text-white text-sm">52-Week</h4>
                <p className="text-xs text-white/60 mt-1">Week 12</p>
              </GlassCard>
            </div>

            {/* Animated Streams */}
            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
              </div>
              <div className="flex justify-center">
                <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* Main Pod Card */}
            <GlassCard className="p-6" glow variant="premium">
              <div className="flex items-center gap-6">
                <PodProgressRing current={3750} target={5000} size={80} />
                <div className="space-y-3">
                  <div>
                    <h3 className="font-bold text-white">Emergency Fund</h3>
                    <p className="text-sm text-white/60">Target $5,000 • by Dec 31</p>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <GlowBadge variant="emerald" size="sm">Round-Up</GlowBadge>
                    <GlowBadge variant="blue" size="sm">Auto-Save</GlowBadge>
                    <GlowBadge variant="purple" size="sm">52-Week</GlowBadge>
                  </div>
                  <p className="text-xs text-white/60">3 inflows connected • 75% complete</p>
                </div>
              </div>
            </GlassCard>

            {/* Secondary Row */}
            <div className="grid grid-cols-3 gap-3 mt-6">
              <GlassCard className="p-3 text-center" variant="subtle">
                <p className="text-xs text-white/60">Choose sink pod</p>
              </GlassCard>
              <GlassCard className="p-3 text-center" variant="subtle">
                <p className="text-xs text-white/60">Pending vs Posted</p>
              </GlassCard>
              <GlassCard className="p-3 text-center" variant="subtle">
                <p className="text-xs text-white/60">% only in public</p>
              </GlassCard>
            </div>
          </div>
        </div>
      </section>


      {/* Meet Lonniee Section */}
      <section id="lonniee" className="container mx-auto px-4 py-24 scroll-mt-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Lonniee Portrait + Badges */}
          <div className="space-y-8">
            <div className="text-center lg:text-left">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Meet Lonniee — your personalized finance expert
              </h2>
              <p className="text-xl text-white/80 mb-8">
                Ask anything about your spend. Lonniee finds waste, proposes safe weekly saves, 
                and hunts deals—then waits for your approval.
              </p>
            </div>

            {/* Lonniee Portrait */}
            <div className="flex justify-center lg:justify-start">
              <div className="relative">
                <div className="w-32 h-32 flex items-center justify-center">
                  <Image 
                    src="/Looniee-logo-main.svg" 
                    alt="Lonniee AI Logo" 
                    width={128} 
                    height={128}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="absolute inset-0 bg-emerald-500/10 blur-xl"></div>
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              <GlowBadge variant="emerald">Non-custodial</GlowBadge>
              <GlowBadge variant="blue">Consent-first</GlowBadge>
              <GlowBadge variant="purple">Privacy by default</GlowBadge>
            </div>

            <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <Link href="/onboarding">Talk to Lonniee</Link>
            </Button>
          </div>

          {/* Right: Live Chat Demo */}
          <div className="space-y-6">
            <GlassCard className="p-6" glow variant="premium">
              <div className="space-y-4">
                {/* Chat Messages */}
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="bg-white/5 rounded-lg p-3 max-w-xs">
                      <p className="text-white text-sm">Running your monthly subscription review...</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 justify-end">
                    <div className="bg-emerald-600 rounded-lg p-3 max-w-xs">
                      <p className="text-white text-sm">Found 2 potential savings →</p>
                    </div>
                  </div>
                </div>

                {/* Subscription Cards */}
                <div className="space-y-2">
                  <GlassCard className="p-3" variant="subtle">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-white font-medium">Netflix</p>
                        <p className="text-white/60 text-sm">Duplicate subscription</p>
                      </div>
                      <p className="text-emerald-400 font-semibold">+$15.99/mo</p>
                    </div>
                  </GlassCard>
                  <GlassCard className="p-3" variant="subtle">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-white font-medium">Telco Plan</p>
                        <p className="text-white/60 text-sm">Overpriced plan</p>
                      </div>
                      <p className="text-emerald-400 font-semibold">+$12/mo</p>
                    </div>
                  </GlassCard>
                </div>

                {/* Approval Preview */}
                <ApprovalPreview
                  title="You can safely save $24/week"
                  description="Based on your spending patterns and available balance"
                  amount="Normal risk level"
                />
              </div>
            </GlassCard>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/5">
                <Zap className="h-4 w-4 mr-2" />
                Run review
              </Button>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/5">
                <Target className="h-4 w-4 mr-2" />
                Suggest save
              </Button>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/5">
                <Coins className="h-4 w-4 mr-2" />
                Post round-ups
              </Button>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/5">
                <CreditCard className="h-4 w-4 mr-2" />
                Find deals
              </Button>
            </div>
          </div>
        </div>
      </section>


      {/* Profiles & Communities Section */}
      <section id="communities" className="container mx-auto px-4 py-24 scroll-mt-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Profiles & Communities — motivation without exposure
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Follow creators you trust. Share tips and % progress—balances stay private.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left: Leaderboard */}
          <div className="space-y-6">
            <GlassCard className="p-6" glow variant="premium">
              <div className="flex items-center gap-3 mb-6">
                <Trophy className="h-6 w-6 text-amber-400" />
                <h3 className="text-xl font-bold text-white">Leaderboard</h3>
                <GlowBadge variant="amber" size="sm">normalized by %</GlowBadge>
              </div>
              
              <div className="space-y-4">
                {[
                  { name: "@ace", progress: 95, avatar: "A" },
                  { name: "@saver", progress: 82, avatar: "S" },
                  { name: "@nova", progress: 76, avatar: "N" },
                  { name: "@thrifty", progress: 68, avatar: "T" },
                  { name: "@wise", progress: 61, avatar: "W" }
                ].map((user, index) => (
                  <div key={user.name} className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold">
                      {user.avatar}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">{user.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-1000"
                            style={{ width: `${user.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-emerald-400 font-semibold text-sm">{user.progress}%</span>
                      </div>
                    </div>
                    {index < 3 && (
                      <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center">
                        <span className="text-amber-400 text-xs font-bold">{index + 1}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Right: Badges & Communities */}
          <div className="space-y-6">
            {/* Badge Rack */}
            <GlassCard className="p-6" glow variant="premium">
              <div className="flex items-center gap-3 mb-6">
                <Medal className="h-6 w-6 text-purple-400" />
                <h3 className="text-xl font-bold text-white">Badge Rack</h3>
              </div>
              
              <div className="grid grid-cols-4 gap-3">
                {[
                  { level: "L1", color: "emerald", earned: true },
                  { level: "L2", color: "blue", earned: true },
                  { level: "L3", color: "purple", earned: true },
                  { level: "L4", color: "amber", earned: false },
                  { level: "L5", color: "emerald", earned: false },
                  { level: "L6", color: "blue", earned: false },
                  { level: "L7", color: "purple", earned: false },
                  { level: "L8", color: "amber", earned: false }
                ].map((badge) => (
                  <div 
                    key={badge.level}
                    className={`aspect-square rounded-lg flex items-center justify-center text-sm font-bold transition-all ${
                      badge.earned 
                        ? `bg-${badge.color}-500/20 text-${badge.color}-400 border border-${badge.color}-500/30` 
                        : 'bg-white/5 text-white/30 border border-white/10'
                    }`}
                  >
                    {badge.level}
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Community Tiles */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white mb-4">Communities</h3>
              
              {[
                { name: "Education Savers", members: "2.3k", color: "emerald" },
                { name: "Round-Up Ninjas", members: "1.8k", color: "blue" },
                { name: "52-Week Crew", members: "1.2k", color: "purple" }
              ].map((community) => (
                <GlassCard key={community.name} className="p-4 cursor-pointer hover:scale-105 transition-transform" glow>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-white">{community.name}</h4>
                      <p className="text-white/60 text-sm">{community.members} members</p>
                    </div>
                    <div className={`w-3 h-3 rounded-full bg-${community.color}-500`}></div>
                  </div>
                </GlassCard>
              ))}
            </div>

            <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white w-full">
              <Link href="/onboarding">Explore communities</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Security & Privacy Section */}
      <section id="security" className="container mx-auto px-4 py-24 scroll-mt-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Security & Privacy — trust center teaser
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            End on confidence; echo core promises.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <GlassCard className="p-8 text-center" glow variant="premium">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
              <Lock className="h-8 w-8 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">Non-custodial</h3>
            <p className="text-white/70">Your money stays in your bank.</p>
          </GlassCard>

          <GlassCard className="p-8 text-center" glow variant="premium">
            <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-6">
              <Check className="h-8 w-8 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">Consent-first</h3>
            <p className="text-white/70">You approve every action; nothing moves automatically.</p>
          </GlassCard>

          <GlassCard className="p-8 text-center" glow variant="premium">
            <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-6">
              <EyeOff className="h-8 w-8 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">Privacy by default</h3>
            <p className="text-white/70">Public shows alias & % only—never balances.</p>
          </GlassCard>
        </div>

        <div className="text-center">
          <p className="text-white/60 mb-6">
            Read-only connection via trusted providers (Plaid). Encrypt at rest. Export & delete anytime.
          </p>
          <Button variant="outline" asChild className="border-white/20 text-white hover:bg-white/5">
            <Link href="/security">Read Security & Privacy</Link>
          </Button>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="container mx-auto px-4 py-24">
        <GlassCard className="p-12 text-center" glow variant="premium">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to start your first pod?
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Join the creditworthy. Experience the ascension yourself.
          </p>
          <Button size="lg" asChild className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 text-lg">
            <Link href="/onboarding">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </GlassCard>
      </section>

      {/* Trust Strip */}
      <div className="border-t border-white/10 bg-black/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-white/60 text-sm">
            Read-only. We never move money. Disconnect anytime.
          </p>
        </div>
      </div>

      {/* Footer moved to global layout via <SiteFooter /> */}
    </div>
  )
}
