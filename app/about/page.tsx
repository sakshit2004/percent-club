"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ShieldCheck, Users, Sparkles, Target, Zap, ArrowRight, Home, Heart, TrendingUp, MessageCircle } from "lucide-react"
import Image from "next/image"

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/percentclub-logo.svg" alt="percent club logo" width={40} height={40} />
            <span className="text-xl font-bold">percent club</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">Home</span>
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/auth/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/sign-up">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section id="top" className="border-b bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Finance is better together</h1>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            percent club connects people through vibrant communities, collaborative challenges, and personalized AI coaching.
          </p>
          <div className="flex items-center justify-center gap-3 mb-6">
            <Badge variant="secondary">Non‑custodial</Badge>
            <Badge variant="secondary">Consent‑first</Badge>
            <Badge variant="secondary">Privacy by design</Badge>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg">
              <Link href="/onboarding">Open the app</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/how-it-works">How it works</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Mission & Principles */}
      <section id="mission" className="container mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">Mission & Principles</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base"><Users className="h-5 w-5" /> Community‑first approach</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">Finance works better when people support each other. Join vibrant communities with shared goals.</CardContent>
          </Card>
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base"><ShieldCheck className="h-5 w-5" /> Privacy by design</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">Your money stays in your bank. We use read-only access and never move your funds.</CardContent>
          </Card>
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base"><Sparkles className="h-5 w-5" /> AI‑powered coaching</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">Lonniee provides private finance coaching while communities offer peer support and motivation.</CardContent>
          </Card>
        </div>
      </section>

      {/* Our Story */}
      <section id="story" className="container mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Our story</h2>
        <p className="text-muted-foreground max-w-3xl mb-6">
          We started percent club after realizing that finance works better when people support each other. Our insight: 
          when saving becomes social, collaborative, and community-driven, people achieve more together. We focus on 
          Communities (peer support), Challenges (collaborative goals), and Lonniee (private AI coaching) to create 
          lasting financial success.
        </p>
        <div className="grid md:grid-cols-4 gap-4 text-sm">
          <TimelineItem title="Idea" desc="Community-first finance platform" />
          <TimelineItem title="Prototype" desc="Communities + Challenges + AI coach" />
          <TimelineItem title="First users" desc="Early wins from collaborative challenges" />
          <TimelineItem title="Today" desc="Open beta with vibrant communities" />
        </div>
      </section>

      {/* Product in short */}
      <section id="product" className="container mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">The product, in short</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <MiniCard icon={<Users className="h-5 w-5" />} title="Communities" desc="Diverse groups with shared goals" />
          <MiniCard icon={<Zap className="h-5 w-5" />} title="Challenges" desc="Collaborative savings activities" />
          <MiniCard icon={<Image src="/Looniee-logo-main.svg" alt="Looniee AI" width={20} height={20} className="w-5 h-5 object-contain" />} title="Lonniee" desc="Private finance coach" />
        </div>
      </section>

      {/* Team & Advisors */}
       <section id="team" className="container mx-auto px-4 py-16">
         <h2 className="text-2xl md:text-3xl font-bold mb-6">Team & Advisors</h2>
         <div className="flex justify-center">
           <Card className="flex items-center gap-6 p-8 max-w-lg">
             <div className="h-24 w-24 rounded-full overflow-hidden bg-muted flex items-center justify-center">
               <img 
                 src="/sakshit-ai.jpg" 
                 alt="Sakshit Sharma" 
                 className="h-full w-full object-cover"
                 onError={(e) => {
                   // Fallback to initials if image fails to load
                   e.currentTarget.style.display = 'none';
                   const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                   if (nextElement) {
                     nextElement.style.display = 'flex';
                   }
                 }}
               />
               <div className="h-full w-full bg-muted flex items-center justify-center text-xl font-medium" style={{display: 'none'}}>
                 SS
               </div>
             </div>
             <div>
               <div className="font-semibold text-xl mb-1">Sakshit Sharma</div>
               <div className="text-muted-foreground mb-2">Founder</div>
               <p className="text-sm text-muted-foreground">
                 Building the future of non-custodial savings with privacy-first principles.
               </p>
             </div>
           </Card>
         </div>
        <div className="mt-6 text-sm text-muted-foreground">
          Contact: <Link href="mailto:hello@percent.club" className="underline">hello@percent.club</Link>
        </div>
      </section>

      {/* Community Impact */}
      <section id="community" className="container mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Community Impact</h2>
        <div className="grid md:grid-cols-3 gap-6 text-sm">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4" />
                Active Communities
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              "15.2k members across 47 diverse communities, from students to investors, all supporting each other's financial goals."
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Success Stories
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              "2.1M challenges completed with 94% success rate. Community members save 18% more than those going it alone."
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Peer Support
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              "Daily encouragement, shared tips, and collaborative challenges create lasting financial habits and friendships."
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="container mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">How It Works</h2>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-xl font-semibold mb-4">Community + AI = Better Finance</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <Users className="h-4 w-4 text-blue-500" />
                </div>
                <div>
                  <h4 className="font-medium">Join Communities</h4>
                  <p className="text-sm text-muted-foreground">Find your finance tribe - students, professionals, families, or side-hustlers.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <Zap className="h-4 w-4 text-emerald-500" />
                </div>
                <div>
                  <h4 className="font-medium">Collaborative Challenges</h4>
                  <p className="text-sm text-muted-foreground">Tackle savings goals together with group challenges and peer motivation.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <Target className="h-4 w-4 text-purple-500" />
                </div>
                <div>
                  <h4 className="font-medium">Private AI Coaching</h4>
                  <p className="text-sm text-muted-foreground">Lonniee provides personalized advice while keeping your data private.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-500/10 to-emerald-500/10 rounded-2xl p-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h4 className="font-semibold mb-2">The Magic Formula</h4>
              <p className="text-sm text-muted-foreground">
                Community support + AI coaching + collaborative challenges = 
                lasting financial success
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Careers */}
      <section id="careers" className="container mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">Careers</h2>
        <p className="text-muted-foreground mb-4">We’re tiny and fast. If you ship, say hi.</p>
        <Button asChild>
          <Link href="mailto:hello@percent.club">Email us</Link>
        </Button>
      </section>

      {/* Bottom CTA */}
      <section className="container mx-auto px-4 pb-16">
        <div className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-8 text-center">
          <h2 className="text-2xl font-bold mb-3">Ready to try percent club?</h2>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/onboarding">Get started</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}

function MiniCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">{icon} <span>{title}</span></CardTitle>
        <CardDescription>{desc}</CardDescription>
      </CardHeader>
    </Card>
  )
}

function TimelineItem({ title, desc }: { title: string; desc: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">{desc}</CardContent>
    </Card>
  )
}
