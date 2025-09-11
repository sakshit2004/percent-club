import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, Zap, Bot, Users, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function OfferingsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-6">
        <Button asChild variant="outline" size="sm">
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to landing
          </Link>
        </Button>
      </div>
      <h1 className="text-3xl font-bold mb-4">What We Offer</h1>
      <p className="text-muted-foreground mb-8 max-w-2xl">
        Everything you need to plan, automate, and celebrate your savings.
      </p>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center">
              <Target className="h-5 w-5 text-primary" />
            </div>
            <CardTitle>Pods</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">Goal-based buckets with visual progress.</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="h-10 w-10 rounded bg-success/10 flex items-center justify-center">
              <Zap className="h-5 w-5 text-success" />
            </div>
            <CardTitle>Challenges</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">Round-ups, weekly autosave, and more.</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="h-10 w-10 rounded bg-info/10 flex items-center justify-center">
              <Bot className="h-5 w-5 text-info" />
            </div>
            <CardTitle>AI Agent</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">Finds savings and suggests safe-to-save.</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="h-10 w-10 rounded bg-secondary/10 flex items-center justify-center">
              <Users className="h-5 w-5" />
            </div>
            <CardTitle>Community</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">Motivation from people on the same path.</CardContent>
        </Card>
      </div>
    </div>
  )
}
