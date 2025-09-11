import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-6">
        <Button asChild variant="outline" size="sm">
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to landing
          </Link>
        </Button>
      </div>
      <h1 className="text-3xl font-bold mb-4">About percentclub</h1>
      <p className="text-muted-foreground mb-6 max-w-2xl">
        We help you save smarter with goal-based Pods, automated Challenges, and an AI savings assistant — all designed
        to make building good financial habits simple and motivating.
      </p>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="p-6 rounded-lg border bg-card">
          <h3 className="font-semibold mb-2">Privacy first</h3>
          <p className="text-sm text-muted-foreground">Share only what you choose. Percent-based sharing, never balances.</p>
        </div>
        <div className="p-6 rounded-lg border bg-card">
          <h3 className="font-semibold mb-2">Motivation built-in</h3>
          <p className="text-sm text-muted-foreground">Communities and streaks help you stay on track.</p>
        </div>
        <div className="p-6 rounded-lg border bg-card">
          <h3 className="font-semibold mb-2">Open roadmap</h3>
          <p className="text-sm text-muted-foreground">We build in public and ship improvements weekly.</p>
        </div>
      </div>
    </div>
  )
}
