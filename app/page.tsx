import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Coins, Target, Bot, ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src="/percentclub-logo.svg" alt="percentclub logo" width={44} height={44} priority />
            <span className="text-xl font-bold">percentclub</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">
              About Us
            </Link>
            <Link href="/offerings" className="text-sm text-muted-foreground hover:text-foreground">
              What We Offer
            </Link>
            <Link href="/how-it-works" className="text-sm text-muted-foreground hover:text-foreground">
              How It Works
            </Link>
            <Link href="/learn/challenges" className="text-sm text-muted-foreground hover:text-foreground">
              Challenges
            </Link>
            <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground">
              Pricing
            </Link>
          </div>
          <div className="flex items-center gap-4">
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
            <Link href="#features">View Demo</Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Three powerful ways to save</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            percentclub combines goal-based savings, automated challenges, and AI-powered insights to help you build
            better financial habits.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Pods Feature */}
          <Card className="relative overflow-hidden">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Smart Pods</CardTitle>
              <CardDescription>
                Create savings goals that work for you. Track progress with beautiful visualizations and celebrate
                milestones.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Visual progress tracking</li>
                <li>• Flexible target dates</li>
                <li>• Multiple funding sources</li>
                <li>• Social sharing options</li>
              </ul>
            </CardContent>
          </Card>

          {/* Challenges Feature */}
          <Card className="relative overflow-hidden">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-success/10 flex items-center justify-center mb-4">
                <Coins className="h-6 w-6 text-success" />
              </div>
              <CardTitle>Automated Challenges</CardTitle>
              <CardDescription>
                Turn saving into a game with challenges like Round-Ups, Weekly Auto-Save, and Cashback Hunt.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Round-up spare change</li>
                <li>• Weekly auto-deposits</li>
                <li>• 52-week challenge</li>
                <li>• Cashback optimization</li>
              </ul>
            </CardContent>
          </Card>

          {/* AI Agent Feature */}
          <Card className="relative overflow-hidden">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-info/10 flex items-center justify-center mb-4">
                <Bot className="h-6 w-6 text-info" />
              </div>
              <CardTitle>AI Savings Agent</CardTitle>
              <CardDescription>
                Your personal financial assistant finds savings opportunities, reviews subscriptions, and suggests
                optimal amounts.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Monthly subscription review</li>
                <li>• Safe-to-save proposals</li>
                <li>• Deal finding & coupons</li>
                <li>• Personalized insights</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to start saving smarter?</h2>
            <p className="text-primary-foreground/80 mb-6 max-w-2xl mx-auto">
              Join thousands of users who have transformed their savings habits with percentclub. No money custody,
              complete privacy, and always free to start.
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/onboarding">
                Get Started Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer moved to global layout via <SiteFooter /> */}
    </div>
  )
}
