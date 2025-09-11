import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap, Coins, ArrowRight, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function ChallengesMarketingPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-6">
        <Button asChild variant="outline" size="sm">
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to landing
          </Link>
        </Button>
      </div>
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-1 text-primary">
          <Zap className="h-4 w-4" />
          <span className="text-sm font-medium">Automated savings</span>
        </div>
        <h1 className="mt-4 text-4xl font-bold">Challenges that save for you</h1>
        <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
          Turn saving into a habit with round-ups, weekly auto-saves, and seasonal goals. Connect a challenge to any Pod — then let it run.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardHeader>
            <CardTitle>Round-Ups</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">Round purchases to the nearest dollar and save the difference automatically.</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Weekly Auto-Save</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">Set a weekly amount and we’ll deposit it into your chosen Pod.</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>52‑Week Challenge</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">Start small and ramp up each week to build momentum and balance.</CardContent>
        </Card>
      </div>

      <div className="text-center">
        <Button asChild size="lg">
          <Link href="/onboarding">Get Started <ArrowRight className="ml-2 h-4 w-4" /></Link>
        </Button>
      </div>
    </div>
  )
}
