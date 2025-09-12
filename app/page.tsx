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

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src="/percentclub-logo.svg" alt="percent club logo" width={44} height={44} priority />
            <span className="text-xl font-bold">percent club</span>
          </div>
          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {/* What We Offer dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="px-2">
                  What We Offer ▾
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[640px] p-4">
                <div className="grid grid-cols-2 gap-4 text-left">
                  <Link href="/#pods" className="rounded-md p-3 hover:bg-accent">
                    <div className="font-semibold">Pods</div>
                    <div className="text-xs text-muted-foreground">Set a goal. See % progress. Keep money in your bank.</div>
                  </Link>
                  <Link href="/#challenges" className="rounded-md p-3 hover:bg-accent">
                    <div className="font-semibold">Prebuilt Challenges</div>
                    <div className="text-xs text-muted-foreground">Round your purchases, auto-save weekly, or 52‑week streak.</div>
                  </Link>
                  <Link href="/#agent" className="rounded-md p-3 hover:bg-accent">
                    <div className="font-semibold">AI Agent</div>
                    <div className="text-xs text-muted-foreground">Your named chatbot for subs, safe‑to‑save, cheaper buys.</div>
                  </Link>
                  <Link href="/#subscriptions" className="rounded-md p-3 hover:bg-accent">
                    <div className="font-semibold">Subscription Cleanup</div>
                    <div className="text-xs text-muted-foreground">Spot duplicates/overpriced. Cancel or reschedule fast.</div>
                  </Link>
                  <Link href="/#deals" className="rounded-md p-3 hover:bg-accent">
                    <div className="font-semibold">Deals & Cashbacks</div>
                    <div className="text-xs text-muted-foreground">Find coupons, gift cards, and card‑linked offers.</div>
                  </Link>
                  <Link href="/#community" className="rounded-md p-3 hover:bg-accent">
                    <div className="font-semibold">Profiles & Communities</div>
                    <div className="text-xs text-muted-foreground">Badges, levels, leaderboards — normalized by %.</div>
                  </Link>
                  <Link href="/#security" className="rounded-md p-3 hover:bg-accent col-span-2">
                    <div className="font-semibold">Security & Privacy</div>
                    <div className="text-xs text-muted-foreground">Non‑custodial. Explicit consent. No public balances.</div>
                  </Link>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link href="/how-it-works" className="text-sm text-muted-foreground hover:text-foreground">How It Works</Link>
            <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">About</Link>
          </div>

          {/* Mobile: hamburger menu */}
          <div className="md:hidden">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="p-0 max-w-sm">
                <div className="p-4 space-y-2">
                  <Link href="/#pods" className="block px-3 py-2 rounded-md hover:bg-accent">What We Offer</Link>
                  <Link href="/how-it-works" className="block px-3 py-2 rounded-md hover:bg-accent">How It Works</Link>
                  <Link href="/about" className="block px-3 py-2 rounded-md hover:bg-accent">About</Link>
                </div>
                <div className="sticky bottom-0 p-4 border-t bg-background">
                  <Button asChild className="w-full">
                    <Link href="/onboarding">Get Started</Link>
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Right actions (desktop) */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/auth/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/onboarding">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <Badge variant="secondary" className="mb-6">
          Save smarter, not harder
        </Badge>
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
          Save smarter with <span className="text-primary">Pods</span>, <span className="text-primary">Challenges</span>
          , and your <span className="text-primary">AI Agent</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
          Transform your savings with gamified goals, automated challenges, and an AI assistant that helps you save more
          and spend less.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/onboarding">
              Get Started Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/onboarding">View Demo</Link>
          </Button>
        </div>
      </section>

      {/* Offerings Sections (anchors) */}
      <section id="pods" className="container mx-auto px-4 pt-16 scroll-mt-24">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left copy */}
          <div>
            <h2 className="text-3xl font-bold mb-2">Pods</h2>
            <p className="text-muted-foreground mb-6">
              Set a goal. See % progress. Keep money in your bank.
            </p>
            <ul className="text-sm text-muted-foreground space-y-2 mb-6">
              <li>• Visual progress with dates and targets</li>
              <li>• Connect inflows from challenges and deals</li>
              <li>• Share progress by % only</li>
            </ul>
          <Button asChild>
            <Link href="/onboarding">Create a Pod</Link>
          </Button>
          </div>
          {/* Right mock card */}
          <Card className="md:justify-self-end w-full max-w-md">
            <CardHeader>
              <CardTitle>Emergency Fund</CardTitle>
              <CardDescription>Target $5,000 • by Dec 31</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-6">
              <PodProgressRing current={3750} target={5000} size={100} />
              <div className="space-y-2">
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="secondary">Round‑Up</Badge>
                  <Badge variant="secondary">Auto‑Save</Badge>
                  <Badge variant="secondary">Cashback</Badge>
                </div>
                <p className="text-sm text-muted-foreground">3 inflows connected • 75% complete</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Challenges */}
      <section id="challenges" className="container mx-auto px-4 py-16 scroll-mt-24">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold">Prebuilt Challenges</h2>
          <p className="text-muted-foreground">Round your purchases, auto‑save weekly, or 52‑week streak.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="transition hover:-translate-y-1 hover:shadow-lg hover:shadow-success/20">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-success/10 flex items-center justify-center mb-4">
                <Coins className="h-6 w-6 text-success" />
              </div>
              <CardTitle>Round‑Ups</CardTitle>
              <CardDescription>Save your digital spare change on every purchase.</CardDescription>
            </CardHeader>
          </Card>
          <Card className="transition hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/20">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Weekly Auto‑Save</CardTitle>
              <CardDescription>Pick an amount; we move it every week.</CardDescription>
            </CardHeader>
          </Card>
          <Card className="transition hover:-translate-y-1 hover:shadow-lg hover:shadow-info/20">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-info/10 flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-info" />
              </div>
              <CardTitle>52‑Week Plan</CardTitle>
              <CardDescription>Start small; ramp up each week.</CardDescription>
            </CardHeader>
          </Card>
        </div>
        <div className="text-center mt-8">
          <Button asChild>
            <Link href="/onboarding">Explore Challenges</Link>
          </Button>
        </div>
      </section>

      {/* AI Agent */}
      <section id="agent" className="container mx-auto px-4 py-16 scroll-mt-24">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div>
            <h2 className="text-3xl font-bold">AI Agent</h2>
            <p className="text-muted-foreground mb-4">Your named chatbot for subs, safe‑to‑save, cheaper buys.</p>
            <ul className="text-sm text-muted-foreground space-y-2 mb-6">
              <li>• Monthly Subscription Review</li>
              <li>• Weekly Safe‑to‑Save proposals</li>
              <li>• Deal‑Finding on demand</li>
            </ul>
            <Button asChild>
              <Link href="/onboarding">Name Your Agent</Link>
            </Button>
          </div>
          <Card className="w-full max-w-md md:justify-self-end">
            <CardContent className="p-4 space-y-3 text-sm">
              <div className="flex gap-2">
                <div className="rounded bg-primary/10 px-3 py-2">Can you review my subscriptions?</div>
              </div>
              <div className="flex gap-2 justify-end">
                <div className="rounded bg-muted px-3 py-2">On it! Found 2 potential savings →</div>
              </div>
              <div className="rounded border p-3">
                • Cancel duplicate “Netflix” $15.99
                <br />• Switch to Spotify Student $5.99
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="subscriptions" className="container mx-auto px-4 py-16 scroll-mt-24">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">Subscription Cleanup</h2>
          <p className="text-muted-foreground">Spot duplicates/overpriced. Cancel or reschedule fast.</p>
        </div>
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-4 py-2">Service</th>
                  <th className="text-left px-4 py-2">Amount</th>
                  <th className="text-left px-4 py-2">Status</th>
                  <th className="text-left px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="px-4 py-2">Netflix</td>
                  <td className="px-4 py-2">$15.99</td>
                  <td className="px-4 py-2 text-amber-600">Duplicate</td>
          <td className="px-4 py-2 flex gap-2"><Button size="sm" variant="outline" asChild><Link href="/onboarding">Cancel</Link></Button><Button size="sm" asChild><Link href="/onboarding">Reschedule</Link></Button></td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2">Spotify</td>
                  <td className="px-4 py-2">$10.99</td>
                  <td className="px-4 py-2 text-green-600">OK</td>
          <td className="px-4 py-2 flex gap-2"><Button size="sm" variant="outline" asChild><Link href="/onboarding">Pause</Link></Button></td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2">Gym</td>
                  <td className="px-4 py-2">$29.99</td>
                  <td className="px-4 py-2 text-orange-600">Low usage</td>
          <td className="px-4 py-2 flex gap-2"><Button size="sm" variant="outline" asChild><Link href="/onboarding">Cancel</Link></Button><Button size="sm" asChild><Link href="/onboarding">Reschedule</Link></Button></td>
                </tr>
              </tbody>
            </table>
          </CardContent>
        </Card>
        <div className="text-center mt-6">
          <Button asChild>
            <Link href="/onboarding">Run a Monthly Review</Link>
          </Button>
        </div>
      </section>

      <section id="deals" className="container mx-auto px-4 py-16 scroll-mt-24">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">Deals & Cashbacks</h2>
          <p className="text-muted-foreground">Find coupons, gift cards, and card‑linked offers.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="transition hover:-translate-y-1 hover:shadow-lg">
            <CardHeader>
              <CardTitle>Coupon</CardTitle>
              <CardDescription>10% off Uber Eats</CardDescription>
            </CardHeader>
          </Card>
          <Card className="transition hover:-translate-y-1 hover:shadow-lg">
            <CardHeader>
              <CardTitle>Gift Card</CardTitle>
              <CardDescription>8% off Amazon</CardDescription>
            </CardHeader>
          </Card>
          <Card className="transition hover:-translate-y-1 hover:shadow-lg">
            <CardHeader>
              <CardTitle>Cashback</CardTitle>
              <CardDescription>5% on Spotify</CardDescription>
            </CardHeader>
          </Card>
        </div>
        <div className="text-center mt-6">
          <Button asChild>
            <Link href="/onboarding">See Today’s Deals</Link>
          </Button>
        </div>
      </section>

      <section id="community" className="container mx-auto px-4 py-16 scroll-mt-24">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">Profiles & Communities</h2>
          <p className="text-muted-foreground">Badges, levels, leaderboards — normalized by %.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Medal className="h-5 w-5" /> Badge Grid</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-4 gap-2 text-center text-xs text-muted-foreground">
              <div className="rounded bg-muted p-3">L1</div>
              <div className="rounded bg-muted p-3">L2</div>
              <div className="rounded bg-muted p-3">L3</div>
              <div className="rounded bg-muted p-3">L4</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Trophy className="h-5 w-5" /> Leaderboard</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <div className="flex justify-between"><span>@ace</span><span>95%</span></div>
              <div className="flex justify-between"><span>@saver</span><span>82%</span></div>
              <div className="flex justify-between"><span>@nova</span><span>76%</span></div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><MessageSquare className="h-5 w-5" /> Tips Feed</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>“Round‑ups + weekly $10 got me to 68%!”</p>
              <p>“Agent found $45 in sub savings this month.”</p>
            </CardContent>
          </Card>
        </div>
        <div className="text-center mt-6">
          <Button asChild>
            <Link href="/onboarding">Browse Communities</Link>
          </Button>
        </div>
      </section>

      <section id="security" className="container mx-auto px-4 py-16 scroll-mt-24">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">Security & Privacy</h2>
          <p className="text-muted-foreground">Non‑custodial. Explicit consent. No public balances.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Lock className="h-5 w-5" /> Read‑only Banking</CardTitle>
              <CardDescription>We connect read‑only to your bank.</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" /> You Approve</CardTitle>
              <CardDescription>Every action requires your consent.</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><EyeOff className="h-5 w-5" /> %‑Only Public</CardTitle>
              <CardDescription>Share alias + % only, never balances.</CardDescription>
            </CardHeader>
          </Card>
        </div>
        <div className="text-center mt-6">
          <Button variant="link" asChild>
            <Link href="/onboarding">Read More</Link>
          </Button>
        </div>
      </section>

      {/* CTA Section */}
      {/* Sticky CTA Band */}
      <section className="container mx-auto px-4 py-16">
        <div className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-8 text-center">
          <h2 className="text-2xl font-bold mb-3">Ready to start your first pod?</h2>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/onboarding">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer moved to global layout via <SiteFooter /> */}
    </div>
  )
}
