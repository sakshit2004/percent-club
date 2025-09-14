"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { PodProgressRing } from "@/components/pods/pod-progress-ring"
import {
  Target,
  Coins,
  TrendingUp,
  Bot,
  MessageSquare,
  ShieldCheck,
  EyeOff,
  ArrowRight,
  Home,
} from "lucide-react"

const fadeIn = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
}

export default function HowItWorksPage() {
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
          <motion.h1 {...fadeIn} className="text-4xl md:text-5xl font-bold mb-3">
            How percent club works
          </motion.h1>
          <motion.p {...fadeIn} className="text-muted-foreground mb-6">
            Three simple steps. Non‑custodial, consent‑first.
          </motion.p>
          <motion.div {...fadeIn} className="flex items-center justify-center gap-3 mb-8">
            <Badge variant="secondary">Non‑custodial</Badge>
            <Badge variant="secondary">Explicit consent</Badge>
            <Badge variant="secondary">Privacy by design</Badge>
          </motion.div>
          <motion.div {...fadeIn} className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg">
              <Link href="/onboarding">
                Get started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Step 1 */}
      <section id="step-pod" className="container mx-auto px-4 py-16 scroll-mt-24">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <motion.div {...fadeIn}>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">1) Create a Pod</h2>
            <p className="text-muted-foreground mb-6">
              Name a goal, set a target, track % progress. Your money stays in your bank.
            </p>
            <Button asChild variant="secondary">
              <Link href="/onboarding">Create a pod</Link>
            </Button>
          </motion.div>
          <motion.div {...fadeIn} className="md:justify-self-end w-full max-w-md">
            <Card>
              <CardHeader>
                <CardTitle>Emergency Fund</CardTitle>
                <CardDescription>Target $5,000 • by Dec 31</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center gap-6">
                <PodProgressRing current={3750} target={5000} size={100} />
                <div className="space-y-2">
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="secondary">Round‑Ups</Badge>
                    <Badge variant="secondary">Auto‑Save</Badge>
                    <Badge variant="secondary">Cashback</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">3 inflows connected • 75% complete</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Step 2 */}
      <section id="step-challenge-agent" className="container mx-auto px-4 py-16 scroll-mt-24">
        <motion.h2 {...fadeIn} className="text-2xl md:text-3xl font-bold mb-6">
          2) Enable a Challenge & Name Lonniee
        </motion.h2>
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div {...fadeIn}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Coins className="h-5 w-5 text-success" /> Challenges Library
                </CardTitle>
                <CardDescription>Automate contributions</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <div>• Round‑Ups (spare change)</div>
                <div>• Weekly Auto‑Save (manual or agent‑suggested)</div>
                <div>• 52‑Week Plan (increasing weekly amounts)</div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div {...fadeIn}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-info" /> Name your Agent
                </CardTitle>
                <CardDescription>Personalize your assistant</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground mb-3">Give your AI assistant a name (e.g., “Lonniee”).</div>
                <div className="flex gap-2">
                  <input
                    aria-label="Assistant name"
                    placeholder="Lonniee"
                    className="flex-1 rounded-md border bg-background px-3 py-2 text-sm"
                  />
                  <Button variant="secondary">Save</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Step 3 */}
      <section id="step-approve" className="container mx-auto px-4 py-16 scroll-mt-24">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <motion.div {...fadeIn}>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">3) Approve and watch savings grow</h2>
            <p className="text-muted-foreground mb-4">
              You approve every action. We record only verified savings events into your Pod.
            </p>
            <ul className="text-sm text-muted-foreground space-y-2 mb-6">
              <li>• Cancel/reschedule subs</li>
              <li>• Safe‑to‑save weekly</li>
              <li>• Redeem deals/cashbacks</li>
            </ul>
          </motion.div>
          <motion.div {...fadeIn} className="md:justify-self-end w-full max-w-md">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Before</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center p-6">
                  <PodProgressRing current={2500} target={5000} size={100} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">After</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center p-6">
                  <PodProgressRing current={3200} target={5000} size={100} />
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Agent capabilities */}
      <section id="agent" className="container mx-auto px-4 py-16 scroll-mt-24">
        <motion.h2 {...fadeIn} className="text-2xl md:text-3xl font-bold mb-8">
          What the Agent does
        </motion.h2>
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div className="grid sm:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <ShieldCheck className="h-5 w-5" /> Sub Review
                </CardTitle>
                <CardDescription>Duplicates, overpriced, low‑usage</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <TrendingUp className="h-5 w-5" /> Safe‑to‑Save
                </CardTitle>
                <CardDescription>Weekly, respects your buffer</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <MessageSquare className="h-5 w-5" /> Deal‑Finding
                </CardTitle>
                <CardDescription>Coupons, gift cards, cashbacks</CardDescription>
              </CardHeader>
            </Card>
          </div>
          <Card className="w-full max-w-md md:justify-self-end">
            <CardContent className="p-4 space-y-3 text-sm">
              <div className="flex gap-2">
                <div className="rounded bg-primary/10 px-3 py-2">Find me a cheaper phone plan</div>
              </div>
              <div className="flex gap-2 justify-end">
                <div className="rounded bg-muted px-3 py-2">Found 2 options: save ~$18/mo</div>
              </div>
              <div className="rounded border p-3">• Switch to MVNO A • Negotiate with Carrier B</div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Demo */}
      <section id="demo" className="container mx-auto px-4 py-16 scroll-mt-24">
        <motion.h2 {...fadeIn} className="text-2xl md:text-3xl font-bold mb-8">
          Quick demo
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-6 text-center">
          <Card>
            <CardHeader>
              <CardTitle>Create Pod</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">Name a goal and target date/amount.</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Turn on Round‑Ups</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">Spare change flows into your pod.</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Approve safe‑save + cancel duplicate</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">Agent suggests; you approve with one tap.</CardContent>
          </Card>
        </div>
        <div className="text-center mt-8">
          <Button asChild>
            <Link href="/onboarding">Open the app</Link>
          </Button>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="container mx-auto px-4 py-16 scroll-mt-24">
        <motion.h2 {...fadeIn} className="text-2xl md:text-3xl font-bold mb-6">
          FAQs
        </motion.h2>
        <div className="grid md:grid-cols-2 gap-6 text-sm">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Do you move my money?</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">No—non‑custodial; you approve everything.</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">What do communities see?</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">Alias & % progress only.</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Can I pause challenges?</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">Yes—pause/resume anytime.</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">How do deals work?</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              We surface offers; you redeem and we log savings.
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="container mx-auto px-4 pb-16">
        <div className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-8 text-center">
          <h2 className="text-2xl font-bold mb-3">Ready to start your first Pod?</h2>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/onboarding">Get started</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
