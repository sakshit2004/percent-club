"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ShieldCheck, Users, Sparkles, Target, Bot, Zap, ArrowRight, Home } from "lucide-react"

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
          <h1 className="text-4xl md:text-5xl font-bold mb-3">We’re building savings that stick</h1>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            percent club helps people save—without shame, without custody, with real‑world wins.
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
              <CardTitle className="flex items-center gap-2 text-base"><ShieldCheck className="h-5 w-5" /> Non‑custodial by design</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">Your money stays in your bank. We orchestrate with permission only.</CardContent>
          </Card>
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base"><Sparkles className="h-5 w-5" /> Consent‑first automation</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">You approve actions like safe‑to‑save, cancellations, and transfers.</CardContent>
          </Card>
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base"><Users className="h-5 w-5" /> Community that motivates</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">Percent‑only sharing, badges, and friendly competition—never shaming.</CardContent>
          </Card>
        </div>
      </section>

      {/* Our Story */}
      <section id="story" className="container mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Our story</h2>
        <p className="text-muted-foreground max-w-3xl mb-6">
          We started percent club after realizing most savings tools feel heavy or custodial. Our insight: if saving feels
          small, social, and verified, people keep going. We focus on Pods (clear goals), Challenges (behavioral nudges),
          and an Agent (smart suggestions) to create real‑world wins.
        </p>
        <div className="grid md:grid-cols-4 gap-4 text-sm">
          <TimelineItem title="Idea" desc="A percent‑only, non‑custodial savings layer" />
          <TimelineItem title="Prototype" desc="Pods + Round‑Ups + email reviews" />
          <TimelineItem title="First users" desc="Early wins from sub cleanups and safe‑save" />
          <TimelineItem title="Today" desc="Open beta with community + agent" />
        </div>
      </section>

      {/* Product in short */}
      <section id="product" className="container mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">The product, in short</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <MiniCard icon={<Target className="h-5 w-5" />} title="Pods" desc="Goal buckets with % progress" />
          <MiniCard icon={<Zap className="h-5 w-5" />} title="Challenges" desc="Behaviors like Round‑Ups & Auto‑Save" />
          <MiniCard icon={<Bot className="h-5 w-5" />} title="AI Agent" desc="Subs, safe‑save, and deals" />
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
                   e.currentTarget.nextElementSibling.style.display = 'flex';
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

      {/* Community & Press */}
      <section id="community" className="container mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Community & Press</h2>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quotes</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">“Round‑ups + safe‑save worked when nothing else did.”</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Highlights</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">Early users saw measurable savings within weeks.</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Mentions</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">Fintech newsletters, community forums.</CardContent>
          </Card>
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
