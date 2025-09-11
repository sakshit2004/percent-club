"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Target, Bot, ArrowRight, ArrowLeft, Check } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface OnboardingData {
  alias: string
  agentName: string
  firstPod: {
    name: string
    targetAmount: string
    targetDate: string
  }
}

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [data, setData] = useState<OnboardingData>({
    alias: "",
    agentName: "",
    firstPod: {
      name: "",
      targetAmount: "",
      targetDate: "",
    },
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const totalSteps = 4
  const progress = (currentStep / totalSteps) * 100

  const handleNext = () => {
    setCurrentStep((s) => (s < totalSteps ? s + 1 : s))
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((s) => Math.max(1, s - 1))
    } else {
      if (typeof window !== "undefined" && window.history.length > 1) {
        router.back()
      } else {
        router.push("/")
      }
    }
  }

  const handleComplete = async () => {
    setIsLoading(true)
    // Store onboarding data in localStorage to use after authentication
    localStorage.setItem("blossomOnboardingData", JSON.stringify(data))

    // Redirect to sign-up page
    router.push("/auth/sign-up")
  }

  const handleSkipPod = () => {
    setCurrentStep(4) // Skip to final step
  }

  const canProceedStep1 = data.alias.trim().length >= 2
  const canProceedStep2 = data.agentName.trim().length >= 2
  const canProceedStep3 = data.firstPod.name.trim() && data.firstPod.targetAmount && data.firstPod.targetDate

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold">percent club</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Welcome to your savings journey!</h1>
          <p className="text-muted-foreground">Let's get you set up in just a few steps</p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Content */}
        <Card className="mb-8">
          {/* Step 1: Choose Alias */}
          {currentStep === 1 && (
            <>
              <CardHeader className="text-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Choose your display name</CardTitle>
                <p className="text-muted-foreground">
                  This is how you'll appear to other users in the community. You can change this later.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="alias">Display Name</Label>
                  <Input
                    id="alias"
                    value={data.alias}
                    onChange={(e) => setData({ ...data, alias: e.target.value })}
                    placeholder="e.g., Sarah Chen"
                    className="text-center text-lg"
                  />
                </div>
                <div className="text-center">
                  <Badge variant="outline" className="text-xs">
                    Your privacy is protected - only show what you want to share
                  </Badge>
                </div>
              </CardContent>
            </>
          )}

          {/* Step 2: Name Your Agent */}
          {currentStep === 2 && (
            <>
              <CardHeader className="text-center">
                <div className="h-16 w-16 rounded-full bg-info/10 flex items-center justify-center mx-auto mb-4">
                  <Bot className="h-8 w-8 text-info" />
                </div>
                <CardTitle>Meet your AI savings assistant</CardTitle>
                <p className="text-muted-foreground">
                  Give your AI agent a name. It will help you save money, review subscriptions, and find deals.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="agentName">Agent Name</Label>
                  <Input
                    id="agentName"
                    value={data.agentName}
                    onChange={(e) => setData({ ...data, agentName: e.target.value })}
                    placeholder="e.g., Sage, Alex, Morgan"
                    className="text-center text-lg"
                  />
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Your agent will help you:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Review subscriptions monthly and flag duplicates</li>
                    <li>• Suggest safe amounts to save each week</li>
                    <li>• Find deals and coupons that match your spending</li>
                  </ul>
                </div>
              </CardContent>
            </>
          )}

          {/* Step 3: Create First Pod */}
          {currentStep === 3 && (
            <>
              <CardHeader className="text-center">
                <div className="h-16 w-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-success" />
                </div>
                <CardTitle>Create your first savings pod</CardTitle>
                <p className="text-muted-foreground">
                  Pods are your savings goals. Start with something important to you, like an emergency fund.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="podName">Pod Name</Label>
                  <Input
                    id="podName"
                    value={data.firstPod.name}
                    onChange={(e) => setData({ ...data, firstPod: { ...data.firstPod, name: e.target.value } })}
                    placeholder="e.g., Emergency Fund, Vacation, New Car"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="targetAmount">Target Amount</Label>
                    <Input
                      id="targetAmount"
                      type="number"
                      value={data.firstPod.targetAmount}
                      onChange={(e) =>
                        setData({ ...data, firstPod: { ...data.firstPod, targetAmount: e.target.value } })
                      }
                      placeholder="5000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="targetDate">Target Date</Label>
                    <Input
                      id="targetDate"
                      type="date"
                      value={data.firstPod.targetDate}
                      onChange={(e) => setData({ ...data, firstPod: { ...data.firstPod, targetDate: e.target.value } })}
                    />
                  </div>
                </div>
                <div className="text-center">
                  <Button type="button" variant="outline" onClick={handleSkipPod} className="text-sm bg-transparent">
                    Skip for now - I'll create pods later
                  </Button>
                </div>
              </CardContent>
            </>
          )}

          {/* Step 4: Complete */}
          {currentStep === 4 && (
            <>
              <CardHeader className="text-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Check className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Ready to start saving!</CardTitle>
                <p className="text-muted-foreground">Here's what we've set up for you:</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="font-medium">Display Name</span>
                    <span className="text-muted-foreground">{data.alias}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="font-medium">AI Agent</span>
                    <span className="text-muted-foreground">{data.agentName}</span>
                  </div>
                  {data.firstPod.name && (
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="font-medium">First Pod</span>
                      <span className="text-muted-foreground">{data.firstPod.name}</span>
                    </div>
                  )}
                </div>

                <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                  <h4 className="font-medium text-primary mb-2">Next step:</h4>
                  <p className="text-sm text-muted-foreground">
                    Create your account to save your progress and start your savings journey with percent club!
                  </p>
                </div>
              </CardContent>
            </>
          )}
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button type="button" variant="outline" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          {currentStep < totalSteps ? (
            <Button
              type="button"
              onClick={handleNext}
              disabled={
                (currentStep === 1 && !canProceedStep1) ||
                (currentStep === 2 && !canProceedStep2) ||
                (currentStep === 3 && !canProceedStep3)
              }
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button type="button" onClick={handleComplete} disabled={isLoading}>
              {isLoading ? "Saving..." : "Create Account"}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
