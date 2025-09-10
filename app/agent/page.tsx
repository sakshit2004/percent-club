"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { AgentChat } from "@/components/agent/agent-chat"
import { SuggestionCard } from "@/components/agent/suggestion-card"
import { SubscriptionList } from "@/components/agent/subscription-list"
import { DealCard } from "@/components/agent/deal-card"
import { useToast } from "@/hooks/use-toast"
import { Settings, Bot } from "lucide-react"
import type { Subscription, Offer, AgentProposal } from "@/types"

// Mock data
const mockSubscriptions: Subscription[] = [
  {
    id: "1",
    merchant: "Netflix",
    monthlyCost: 15.99,
    nextChargeDate: "2024-02-15",
    status: "active",
    flags: ["overpriced"],
  },
  {
    id: "2",
    merchant: "Spotify Premium",
    monthlyCost: 9.99,
    nextChargeDate: "2024-02-10",
    status: "active",
    flags: [],
  },
  {
    id: "3",
    merchant: "Adobe Creative Cloud",
    monthlyCost: 52.99,
    nextChargeDate: "2024-02-20",
    status: "active",
    flags: ["duplicate", "low-usage"],
  },
]

const mockOffers: Offer[] = [
  {
    id: "1",
    type: "coupon",
    label: "20% off Grocery Shopping",
    estSavingsLabel: "Save $15",
    sourceLabel: "Whole Foods",
    description: "Valid on orders over $75. Use code SAVE20 at checkout.",
    expiresAt: "2024-02-28",
  },
  {
    id: "2",
    type: "cashback",
    label: "5% Cashback on Gas",
    estSavingsLabel: "Save $8",
    sourceLabel: "Shell Stations",
    description: "Earn 5% cashback on all gas purchases this month.",
  },
  {
    id: "3",
    type: "plan",
    label: "Switch to Mint Mobile",
    estSavingsLabel: "Save $480/year",
    sourceLabel: "Phone Plan",
    description: "Get the same coverage for $15/month instead of $55/month.",
  },
]

const mockSafeToSaveProposal: AgentProposal = {
  id: "1",
  type: "safe-to-save",
  title: "Safe to Save This Week",
  description:
    "Based on your spending patterns and upcoming bills, you can safely save $75 this week without affecting your budget.",
  impactLabel: "$75",
  amount: 75,
  rationale:
    "You typically spend $200 less in the second week of the month, and you have no major bills due until the 20th.",
  actions: [
    { label: "Save $75", variant: "primary", action: "apply-safe-save" },
    { label: "Save $50 Instead", variant: "secondary", action: "apply-safe-save-50" },
  ],
  createdAt: "2024-01-15T10:00:00Z",
}

interface ChatMessage {
  id: string
  role: "user" | "agent"
  text: string
  timestamp: string
  suggestions?: Array<{
    label: string
    action: string
  }>
}

export default function AgentPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [agentName, setAgentName] = useState("Sage")
  const { toast } = useToast()

  const handleSendMessage = async (message: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      text: message,
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const agentMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "agent",
        text: getAgentResponse(message),
        timestamp: new Date().toISOString(),
        suggestions: getMessageSuggestions(message),
      }

      setMessages((prev) => [...prev, agentMessage])
      setIsLoading(false)
    }, 1500)
  }

  const handleSuggestionClick = (action: string) => {
    switch (action) {
      case "review-subscriptions":
        handleSendMessage("Can you review my subscriptions?")
        break
      case "safe-to-save":
        handleSendMessage("How much can I safely save this week?")
        break
      case "find-deals":
        handleSendMessage("Find me some deals to save money")
        break
      case "apply-safe-save":
        toast({
          title: "Savings Applied",
          description: "$75 has been automatically saved to your Emergency Fund.",
        })
        break
      case "apply-safe-save-50":
        toast({
          title: "Savings Applied",
          description: "$50 has been automatically saved to your Emergency Fund.",
        })
        break
      default:
        console.log("Unknown action:", action)
    }
  }

  const handleCancelSubscription = (subscriptionId: string, reason: string) => {
    const subscription = mockSubscriptions.find((s) => s.id === subscriptionId)
    toast({
      title: "Cancellation Initiated",
      description: `We'll help you cancel ${subscription?.merchant}. You'll receive a confirmation email shortly.`,
    })
  }

  const handleRescheduleSubscription = (subscriptionId: string, newDate: string) => {
    const subscription = mockSubscriptions.find((s) => s.id === subscriptionId)
    toast({
      title: "Reschedule Requested",
      description: `We'll contact ${subscription?.merchant} to reschedule your billing date.`,
    })
  }

  const handleRedeemOffer = (offerId: string) => {
    const offer = mockOffers.find((o) => o.id === offerId)
    toast({
      title: "Deal Redeemed",
      description: `${offer?.label} has been added to your wallet. Check your email for details.`,
    })
  }

  const getAgentResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase()

    if (lowerMessage.includes("subscription")) {
      return "I found 3 active subscriptions. Netflix appears overpriced compared to alternatives, and Adobe Creative Cloud shows low usage. Check the Monthly Review tab for detailed analysis and cancellation options."
    }

    if (lowerMessage.includes("save") || lowerMessage.includes("money")) {
      return "Based on your spending patterns, you can safely save $75 this week. I've analyzed your upcoming bills and typical spending to ensure this won't affect your budget. Would you like me to apply this automatically?"
    }

    if (lowerMessage.includes("deal")) {
      return "I found several deals that match your spending patterns! There's a 20% grocery coupon, 5% gas cashback, and a phone plan that could save you $480/year. Check the Deals tab to redeem them."
    }

    return "I'm here to help you save money and manage your finances better. I can review your subscriptions, suggest safe amounts to save, and find deals that match your spending patterns. What would you like to explore?"
  }

  const getMessageSuggestions = (message: string): Array<{ label: string; action: string }> | undefined => {
    const lowerMessage = message.toLowerCase()

    if (lowerMessage.includes("subscription")) {
      return [
        { label: "Cancel Netflix", action: "cancel-netflix" },
        { label: "Review Adobe", action: "review-adobe" },
      ]
    }

    if (lowerMessage.includes("save")) {
      return [
        { label: "Save $75", action: "apply-safe-save" },
        { label: "Save $50", action: "apply-safe-save-50" },
      ]
    }

    return undefined
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Bot className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-semibold">{agentName}</h1>
              <p className="text-sm text-muted-foreground">AI Savings Assistant</p>
            </div>
          </div>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Rename Agent
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat Panel */}
        <div className="flex-1 border-r">
          <AgentChat
            messages={messages}
            onSendMessage={handleSendMessage}
            onSuggestionClick={handleSuggestionClick}
            isLoading={isLoading}
            agentName={agentName}
          />
        </div>

        {/* Suggestion Panel */}
        <div className="w-96 flex flex-col">
          <Tabs defaultValue="review" className="flex-1 flex flex-col">
            <div className="border-b p-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="review" className="text-xs">
                  Monthly Review
                </TabsTrigger>
                <TabsTrigger value="save" className="text-xs">
                  Safe-to-Save
                </TabsTrigger>
                <TabsTrigger value="deals" className="text-xs">
                  Deals
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-y-auto">
              <TabsContent value="review" className="p-4 space-y-4 mt-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Subscription Review</h3>
                  <Badge variant="outline">{mockSubscriptions.length} active</Badge>
                </div>
                <SubscriptionList
                  subscriptions={mockSubscriptions}
                  onCancel={handleCancelSubscription}
                  onReschedule={handleRescheduleSubscription}
                />
              </TabsContent>

              <TabsContent value="save" className="p-4 space-y-4 mt-0">
                <h3 className="font-semibold">Weekly Savings Proposal</h3>
                <SuggestionCard
                  title={mockSafeToSaveProposal.title}
                  description={mockSafeToSaveProposal.description}
                  impactLabel={mockSafeToSaveProposal.impactLabel}
                  actions={mockSafeToSaveProposal.actions.map((action) => ({
                    ...action,
                    onClick: () => handleSuggestionClick(action.action),
                  }))}
                  type="success"
                />
                {mockSafeToSaveProposal.rationale && (
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2">Why this amount?</h4>
                      <p className="text-sm text-muted-foreground">{mockSafeToSaveProposal.rationale}</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="deals" className="p-4 space-y-4 mt-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Available Deals</h3>
                  <Badge variant="outline">{mockOffers.length} found</Badge>
                </div>
                {mockOffers.map((offer) => (
                  <DealCard key={offer.id} offer={offer} onRedeem={handleRedeemOffer} />
                ))}
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
