import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function PricingPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-6">
        <Button asChild variant="outline" size="sm">
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to landing
          </Link>
        </Button>
      </div>
      <h1 className="text-3xl font-bold mb-4">Pricing</h1>
      <p className="text-muted-foreground mb-8">Start free. Upgrade when you want more automation.</p>
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Free</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Pods, communities, basic challenges.
          </CardContent>
        </Card>
        <Card className="border-primary/30">
          <CardHeader>
            <CardTitle>Pro</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Advanced challenges, AI proposals, priority features.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Team</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Group goals for friends/family; coming soon.
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
