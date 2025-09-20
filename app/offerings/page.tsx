import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, Zap, Users, ArrowLeft } from "lucide-react"
import Image from "next/image"
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
        Everything you need to connect with communities, tackle challenges together, and get personalized finance coaching.
      </p>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <CardTitle>Communities</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">Diverse groups with shared financial goals.</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="h-10 w-10 rounded bg-success/10 flex items-center justify-center">
              <Zap className="h-5 w-5 text-success" />
            </div>
            <CardTitle>Challenges</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">Collaborative challenges and group activities.</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="h-10 w-10 rounded bg-info/10 flex items-center justify-center">
              <Image src="/Looniee-logo-main.svg" alt="Looniee AI" width={20} height={20} className="w-5 h-5 object-contain" />
            </div>
            <CardTitle>AI Agent</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">Private finance coach for personalized advice.</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="h-10 w-10 rounded bg-secondary/10 flex items-center justify-center">
              <Users className="h-5 w-5" />
            </div>
            <CardTitle>Community</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">Peer support and shared success stories.</CardContent>
        </Card>
      </div>
    </div>
  )
}
