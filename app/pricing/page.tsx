import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Users, Bot, Check, Zap, Crown, Heart } from "lucide-react"

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
      <div className="text-center mb-12">
        <Badge variant="outline" className="mb-4 border-blue-500/30 text-blue-400">
          <Users className="h-4 w-4 mr-2" />
          Community-First Pricing
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Finance is better together</h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          Join vibrant communities for free, or get personalized coaching with Lonniee. 
          Start your financial journey with others who share your goals.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Community Plan */}
        <Card className="relative">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Users className="h-6 w-6 text-blue-500" />
              <CardTitle className="text-2xl">Community</CardTitle>
            </div>
            <div className="text-4xl font-bold">Free</div>
            <p className="text-muted-foreground">Join vibrant finance communities</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">Access to all communities</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">Collaborative challenges</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">Peer support & motivation</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">Progress tracking</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">Leaderboards & badges</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">Basic savings pods</span>
              </div>
            </div>
            <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
              <Link href="/communities">Join Communities</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Lonniee Plan */}
        <Card className="relative border-emerald-500/30 ring-2 ring-emerald-500/20">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <Badge className="bg-emerald-600 text-white px-4 py-1">
              <Crown className="h-3 w-3 mr-1" />
              Most Popular
            </Badge>
          </div>
          <CardHeader className="text-center pb-4 pt-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Bot className="h-6 w-6 text-emerald-500" />
              <CardTitle className="text-2xl">Lonniee Pro</CardTitle>
            </div>
            <div className="text-4xl font-bold">$9<span className="text-lg text-muted-foreground">/month</span></div>
            <p className="text-muted-foreground">Private finance coaching + communities</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">Everything in Community</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">Personal AI finance coach</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">Subscription cleanup</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">Safe-to-save analysis</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">Cashback discovery</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">Advanced challenges</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">Priority support</span>
              </div>
            </div>
            <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-700">
              <Link href="/agent">Start with Lonniee</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Family Plan */}
        <Card className="relative">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Heart className="h-6 w-6 text-purple-500" />
              <CardTitle className="text-2xl">Family</CardTitle>
            </div>
            <div className="text-4xl font-bold">$19<span className="text-lg text-muted-foreground">/month</span></div>
            <p className="text-muted-foreground">For families saving together</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">Everything in Lonniee Pro</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">Up to 6 family members</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">Shared family goals</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">Kids' savings accounts</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">Family challenges</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">Parental controls</span>
              </div>
            </div>
            <Button asChild variant="outline" className="w-full border-purple-500/30 text-purple-400 hover:bg-purple-500/10">
              <Link href="/auth/sign-up">Coming Soon</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* FAQ Section */}
      <div className="mt-20 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold mb-2">Is the community really free?</h3>
            <p className="text-muted-foreground text-sm">
              Yes! All communities, challenges, and peer support are completely free. 
              We believe finance works better when people support each other.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">What does Lonniee do differently?</h3>
            <p className="text-muted-foreground text-sm">
              Lonniee is your private finance coach that works alongside communities. 
              It provides personalized advice while keeping your data private.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Can I cancel anytime?</h3>
            <p className="text-muted-foreground text-sm">
              Absolutely. You can cancel your Lonniee Pro subscription anytime. 
              You'll keep access to all communities and basic features.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Is my financial data safe?</h3>
            <p className="text-muted-foreground text-sm">
              Yes. We use bank-level security, read-only access, and never move your money. 
              Your privacy is our priority.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
