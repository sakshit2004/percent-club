"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { 
  Settings, 
  Bot, 
  Send, 
  Loader2, 
  CheckCircle, 
  AlertCircle, 
  X, 
  Calendar,
  CreditCard,
  Gift,
  TrendingDown,
  Shield,
  Eye,
  EyeOff,
  Copy,
  Download,
  Undo
} from "lucide-react"
import type { Subscription, Offer, AgentProposal, Pod } from "@/types"

// Mock data - moved outside component to prevent recreation
const mockSubscriptions: Subscription[] = [
  {
    id: "1",
    merchant: "Netflix",
    monthlyCost: 15.99,
    nextChargeDate: "2024-02-15",
    status: "active",
    flags: ["duplicate"],
  },
  {
    id: "2",
    merchant: "Spotify Premium",
    monthlyCost: 10.99,
    nextChargeDate: "2024-02-10",
    status: "active",
    flags: [],
  },
  {
    id: "3",
    merchant: "Telco Plan",
    monthlyCost: 85.00,
    nextChargeDate: "2024-02-20",
    status: "active",
    flags: ["overpriced"],
  },
  {
    id: "4",
    merchant: "Gym Membership",
    monthlyCost: 29.99,
    nextChargeDate: "2024-02-12",
    status: "active",
    flags: ["low-usage"],
  },
  {
    id: "5",
    merchant: "Dropbox",
    monthlyCost: 11.99,
    nextChargeDate: "2024-02-18",
    status: "active",
    flags: [],
  },
]

const mockOffers: Offer[] = [
  {
    id: "1",
    type: "coupon",
    label: "10% off Uber Eats",
    estSavingsLabel: "≈ $5",
    sourceLabel: "Example",
    description: "Valid on orders over $25. Use code SAVE10 at checkout.",
    expiresAt: "2024-02-28",
  },
  {
    id: "2",
    type: "giftcard",
    label: "8% off Amazon Gift Card",
    estSavingsLabel: "≈ $8",
    sourceLabel: "Example",
    description: "Buy a $100 gift card for $92. Perfect for future purchases.",
  },
  {
    id: "3",
    type: "cashback",
    label: "5% Cashback on Spotify",
    estSavingsLabel: "≈ $0.55",
    sourceLabel: "Example",
    description: "Get cashback on your next Spotify Premium subscription.",
  },
  {
    id: "4",
    type: "plan",
    label: "Lower-cost Telco Plan",
    estSavingsLabel: "≈ $10/mo",
    sourceLabel: "Example",
    description: "Switch to a plan with the same coverage for $10 less per month.",
  },
]

const mockPods: Pod[] = [
  {
  id: "1",
    name: "Education",
    targetAmount: 15000,
    currentAmount: 6300,
    targetDate: "2025-06-01",
    isFeatured: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "2",
    name: "Travel",
    targetAmount: 5000,
    currentAmount: 750,
    targetDate: "2024-12-15",
    isFeatured: false,
    createdAt: "2024-02-01T00:00:00Z",
    updatedAt: "2024-02-15T00:00:00Z",
  },
]

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
  const [agentName, setAgentName] = useState("Penny")
  const [activeTab, setActiveTab] = useState("subs")
  const [isMobile, setIsMobile] = useState(false)
  const [showUndo, setShowUndo] = useState(false)
  const [lastAction, setLastAction] = useState<string | null>(null)
  
  // Dialog states
  const [renameDialogOpen, setRenameDialogOpen] = useState(false)
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false)
  const [rescheduleDialogOpen, setRescheduleDialogOpen] = useState(false)
  const [sinkPodDialogOpen, setSinkPodDialogOpen] = useState(false)
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false)
  
  // Form states
  const [newAgentName, setNewAgentName] = useState("")
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null)
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null)
  const [selectedPod, setSelectedPod] = useState<Pod | null>(null)
  const [riskLevel, setRiskLevel] = useState("normal")
  const [searchQuery, setSearchQuery] = useState("")
  
  const { toast } = useToast()

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage: ChatMessage = {
      id: "welcome",
      role: "agent",
      text: `Hi! I'm ${agentName}, your personal savings assistant. I'm here to help you cut costs, find deals, and save more money. I can review your subscriptions, suggest safe amounts to save, and find better deals for things you're buying. What would you like to explore?`,
      timestamp: new Date().toISOString(),
      suggestions: [
        { label: "Run monthly review", action: "review-subscriptions" },
        { label: "Suggest weekly save", action: "safe-to-save" },
        { label: "Find cheaper internet", action: "find-deals" },
      ],
    }
    setMessages([welcomeMessage])
  }, [agentName])

  // Check for mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

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
        setActiveTab("subs")
        break
      case "safe-to-save":
        handleSendMessage("How much can I safely save this week?")
        setActiveTab("save")
        break
      case "find-deals":
        handleSendMessage("Find me some deals to save money")
        setActiveTab("deals")
        break
      case "show-subscriptions":
        setActiveTab("subs")
        break
      default:
        console.log("Unknown action:", action)
    }
  }

  const handleRenameAgent = () => {
    if (newAgentName.trim()) {
      setAgentName(newAgentName.trim())
    toast({
        title: "Agent renamed",
        description: `to ${newAgentName.trim()}`,
      })
      setRenameDialogOpen(false)
      setNewAgentName("")
    }
  }

  const handleCancelSubscription = (subscription: Subscription) => {
    setSelectedSubscription(subscription)
    setTemplateDialogOpen(true)
  }

  const handleRescheduleSubscription = (subscription: Subscription) => {
    setSelectedSubscription(subscription)
    setRescheduleDialogOpen(true)
  }

  const handleMarkLowUsage = (subscriptionId: string) => {
    toast({
      title: "Flagged for review",
      description: "We'll remind you next cycle.",
    })
  }

  const handleRedeemOffer = (offer: Offer) => {
    setSelectedOffer(offer)
    setSinkPodDialogOpen(true)
  }

  const handleSafeToSave = (amount: number) => {
    setPreviewDialogOpen(true)
    // Store the amount for later use
  }

  const handleApplyAction = (action: string, data: any) => {
    setLastAction(action)
    setShowUndo(true)
    setTimeout(() => setShowUndo(false), 5000)
    
    // Add agent message to chat
    const agentMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "agent",
      text: getActionConfirmationMessage(action, data),
      timestamp: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, agentMessage])
  }

  const handleUndo = () => {
    toast({
      title: "Reverted",
      description: "Action has been undone.",
    })
    setShowUndo(false)
    setLastAction(null)
  }

  const getAgentResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase()

    if (lowerMessage.includes("subscription")) {
      return "I found 5 active subscriptions with potential savings of $28/mo. Netflix is flagged as duplicate, Telco Plan is overpriced, and Gym Membership shows low usage. Check the Monthly Review tab for detailed analysis and actions."
    }

    if (lowerMessage.includes("save") || lowerMessage.includes("money")) {
      return "Based on your spending patterns, you can safely save $24/week. Bills cluster Tue–Thu, so this keeps a $25 buffer. Would you like me to preview this deposit?"
    }

    if (lowerMessage.includes("deal")) {
      return "I found 4 deals that could save you money! There's a 10% Uber Eats coupon, 8% Amazon gift card discount, Spotify cashback, and a cheaper telco plan. Check the Deals tab to redeem them."
    }

    return "I'm here to help you save money and manage your finances better. I can review your subscriptions, suggest safe amounts to save, and find deals that match your spending patterns. What would you like to explore?"
  }

  const getMessageSuggestions = (message: string): Array<{ label: string; action: string }> | undefined => {
    const lowerMessage = message.toLowerCase()

    if (lowerMessage.includes("subscription")) {
      return [
        { label: "Show my subscriptions", action: "show-subscriptions" },
        { label: "Cancel Netflix", action: "cancel-netflix" },
      ]
    }

    if (lowerMessage.includes("save")) {
      return [
        { label: "Preview $24 deposit", action: "preview-save" },
        { label: "Schedule weekly saves", action: "schedule-saves" },
      ]
    }

    return undefined
  }

  const getActionConfirmationMessage = (action: string, data: any): string => {
    switch (action) {
      case "cancel":
        return `I've prepared a cancel email for ${data.merchant}. The template is ready to send.`
      case "reschedule":
        return `I've prepared a reschedule request for ${data.merchant}. This will help avoid late fees.`
      case "save":
        return `Deposited $${data.amount} to ${data.podName} pod.`
      case "redeem":
        return `Logged $${data.savings} saved from ${data.offerName}.`
      default:
        return "Action completed successfully."
    }
  }

  const getSafeToSaveAmount = useCallback(() => {
    switch (riskLevel) {
      case "cautious": return 18
      case "normal": return 24
      case "aggressive": return 32
      default: return 24
    }
  }, [riskLevel])

  const getFilteredOffers = useMemo(() => {
    if (!searchQuery) return mockOffers
    return mockOffers.filter(offer => 
      offer.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (offer.description && offer.description.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  }, [searchQuery])

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur sticky top-0 z-50">
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
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <Badge variant="outline" className="text-xs">Consent-first</Badge>
              <Badge variant="outline" className="text-xs">Non-custodial</Badge>
              <Badge variant="outline" className="text-xs">Privacy by default</Badge>
            </div>
            <Button variant="outline" size="sm" onClick={() => setRenameDialogOpen(true)}>
            <Settings className="h-4 w-4 mr-2" />
              Rename
          </Button>
          </div>
        </div>
        <div className="container mx-auto px-4 pb-2">
          <p className="text-xs text-muted-foreground">We only propose; you approve. No funds move without consent.</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {!isMobile ? (
          <>
        {/* Chat Panel */}
        <div className="flex-1 border-r">
              <ChatInterface
            messages={messages}
            onSendMessage={handleSendMessage}
            onSuggestionClick={handleSuggestionClick}
            isLoading={isLoading}
            agentName={agentName}
          />
        </div>

            {/* Assistant Console */}
        <div className="w-96 flex flex-col">
              <AssistantConsole
                activeTab={activeTab}
                onTabChange={setActiveTab}
                subscriptions={mockSubscriptions}
                offers={getFilteredOffers}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                riskLevel={riskLevel}
                onRiskChange={setRiskLevel}
                safeToSaveAmount={getSafeToSaveAmount()}
                onCancelSubscription={handleCancelSubscription}
                onRescheduleSubscription={handleRescheduleSubscription}
                onMarkLowUsage={handleMarkLowUsage}
                onRedeemOffer={handleRedeemOffer}
                onSafeToSave={handleSafeToSave}
              />
            </div>
          </>
        ) : (
          /* Mobile Layout */
          <div className="flex-1 flex flex-col">
            <ChatInterface
              messages={messages}
              onSendMessage={handleSendMessage}
              onSuggestionClick={handleSuggestionClick}
              isLoading={isLoading}
              agentName={agentName}
            />
            <MobileTabBar
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>
        )}
      </div>

      {/* Floating Undo Bar */}
      {showUndo && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-background border rounded-lg p-3 shadow-lg z-50">
          <div className="flex items-center gap-3">
            <span className="text-sm">Action applied</span>
            <Button variant="outline" size="sm" onClick={handleUndo}>
              <Undo className="h-4 w-4 mr-1" />
              Undo
            </Button>
          </div>
        </div>
      )}

      {/* Dialogs */}
      <RenameDialog
        open={renameDialogOpen}
        onOpenChange={setRenameDialogOpen}
        agentName={newAgentName}
        onAgentNameChange={setNewAgentName}
        onRename={handleRenameAgent}
      />

      <TemplatePreviewDialog
        open={templateDialogOpen}
        onOpenChange={setTemplateDialogOpen}
        subscription={selectedSubscription}
        onConfirm={(podId) => {
          const pod = mockPods.find(p => p.id === podId)
          toast({
            title: `Canceled ${selectedSubscription?.merchant}`,
            description: `+$${selectedSubscription?.monthlyCost}/mo planned → ${pod?.name} pod`,
          })
          setTemplateDialogOpen(false)
          handleApplyAction("cancel", selectedSubscription)
        }}
      />

      <RescheduleDialog
        open={rescheduleDialogOpen}
        onOpenChange={setRescheduleDialogOpen}
        subscription={selectedSubscription}
        onConfirm={(podId) => {
          const pod = mockPods.find(p => p.id === podId)
          toast({
            title: `Rescheduled ${selectedSubscription?.merchant}`,
            description: `avoids $10 fee next month → ${pod?.name} pod`,
          })
          setRescheduleDialogOpen(false)
          handleApplyAction("reschedule", selectedSubscription)
        }}
      />

      <SinkPodSelectorDialog
        open={sinkPodDialogOpen}
        onOpenChange={setSinkPodDialogOpen}
        pods={mockPods}
        onConfirm={(podId) => {
          const pod = mockPods.find(p => p.id === podId)
          const savings = selectedOffer?.estSavingsLabel?.match(/\$(\d+)/)?.[1] || "5"
          toast({
            title: `Redeemed ${selectedOffer?.label}`,
            description: `saved $${savings} → ${pod?.name} pod`,
          })
          setSinkPodDialogOpen(false)
          handleApplyAction("redeem", { offerName: selectedOffer?.label, savings })
        }}
      />

      <PreviewApplyDialog
        open={previewDialogOpen}
        onOpenChange={setPreviewDialogOpen}
        amount={getSafeToSaveAmount()}
        pods={mockPods}
        onConfirm={(podId) => {
          const pod = mockPods.find(p => p.id === podId)
          toast({
            title: `$${getSafeToSaveAmount()} saved`,
            description: `→ ${pod?.name} pod`,
          })
          setPreviewDialogOpen(false)
          handleApplyAction("save", { amount: getSafeToSaveAmount(), podName: pod?.name })
        }}
      />
    </div>
  )
}

// Chat Interface Component
interface ChatInterfaceProps {
  messages: ChatMessage[]
  onSendMessage: (message: string) => void
  onSuggestionClick: (action: string) => void
  isLoading: boolean
  agentName: string
}

function ChatInterface({ messages, onSendMessage, onSuggestionClick, isLoading, agentName }: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue.trim())
      setInputValue("")
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            {message.role === "agent" && (
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <Bot className="h-4 w-4 text-primary-foreground" />
              </div>
            )}
            <div className={`max-w-[80%] ${message.role === "user" ? "order-first" : ""}`}>
              <Card className={message.role === "user" ? "bg-primary text-primary-foreground" : ""}>
                <CardContent className="p-3">
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </CardContent>
              </Card>
              {message.suggestions && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {message.suggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => onSuggestionClick(suggestion.action)}
                      className="text-xs"
                    >
                      {suggestion.label}
                    </Button>
                  ))}
                </div>
              )}
            </div>
            {message.role === "user" && (
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-medium">U</span>
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <Loader2 className="h-4 w-4 text-primary-foreground animate-spin" />
            </div>
            <Card className="bg-muted/50">
              <CardContent className="p-3">
                <p className="text-sm text-muted-foreground">Thinking...</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="border-t p-4">
        <div className="flex flex-wrap gap-2 mb-3">
          <Button variant="outline" size="sm" onClick={() => onSuggestionClick("review-subscriptions")}>
            Run monthly review
          </Button>
          <Button variant="outline" size="sm" onClick={() => onSuggestionClick("safe-to-save")}>
            Suggest weekly save
          </Button>
          <Button variant="outline" size="sm" onClick={() => onSuggestionClick("find-deals")}>
            Find cheaper internet
          </Button>
        </div>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask me to cut costs, find deals, or propose a weekly save…"
            disabled={isLoading}
          />
          <Button type="submit" disabled={!inputValue.trim() || isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}

// Assistant Console Component
interface AssistantConsoleProps {
  activeTab: string
  onTabChange: (tab: string) => void
  subscriptions: Subscription[]
  offers: Offer[]
  searchQuery: string
  onSearchChange: (query: string) => void
  riskLevel: string
  onRiskChange: (level: string) => void
  safeToSaveAmount: number
  onCancelSubscription: (subscription: Subscription) => void
  onRescheduleSubscription: (subscription: Subscription) => void
  onMarkLowUsage: (subscriptionId: string) => void
  onRedeemOffer: (offer: Offer) => void
  onSafeToSave: (amount: number) => void
}

function AssistantConsole({
  activeTab,
  onTabChange,
  subscriptions,
  offers,
  searchQuery,
  onSearchChange,
  riskLevel,
  onRiskChange,
  safeToSaveAmount,
  onCancelSubscription,
  onRescheduleSubscription,
  onMarkLowUsage,
  onRedeemOffer,
  onSafeToSave,
}: AssistantConsoleProps) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="flex-1 flex flex-col">
            <div className="border-b p-4">
              <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="subs" className="text-xs">Monthly Review</TabsTrigger>
          <TabsTrigger value="save" className="text-xs">Safe-to-Save</TabsTrigger>
          <TabsTrigger value="deals" className="text-xs">Deals</TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-y-auto">
        <TabsContent value="subs" className="p-4 space-y-4 mt-0">
                <div className="flex items-center justify-between">
            <h3 className="font-semibold">Monthly Review</h3>
            <Badge variant="outline">{subscriptions.length} subscriptions</Badge>
          </div>
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-sm font-medium">5 subscriptions • Potential savings: $28/mo</p>
                </div>
          <SubscriptionTable
            subscriptions={subscriptions}
            onCancel={onCancelSubscription}
            onReschedule={onRescheduleSubscription}
            onMarkLowUsage={onMarkLowUsage}
          />
          <p className="text-xs text-muted-foreground">
            We detect recurring merchants by interval patterns. You approve every change.
          </p>
              </TabsContent>

              <TabsContent value="save" className="p-4 space-y-4 mt-0">
          <h3 className="font-semibold">Safe-to-Save</h3>
          <SafeToSaveCard
            amount={safeToSaveAmount}
            riskLevel={riskLevel}
            onRiskChange={onRiskChange}
            onSafeToSave={onSafeToSave}
          />
              </TabsContent>

              <TabsContent value="deals" className="p-4 space-y-4 mt-0">
                <div className="flex items-center justify-between">
            <h3 className="font-semibold">Deals</h3>
            <Badge variant="outline">{offers.length} found</Badge>
                </div>
          <Input
            placeholder="What are you buying?"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <div className="space-y-3">
            {offers.map((offer) => (
              <DealCard key={offer.id} offer={offer} onRedeem={onRedeemOffer} />
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Offers shown are examples; availability may vary.
          </p>
              </TabsContent>
            </div>
          </Tabs>
  )
}

// Mobile Tab Bar Component
interface MobileTabBarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

function MobileTabBar({ activeTab, onTabChange }: MobileTabBarProps) {
  return (
    <div className="border-t bg-background">
      <div className="flex">
        <Button
          variant={activeTab === "subs" ? "default" : "ghost"}
          className="flex-1 rounded-none"
          onClick={() => onTabChange("subs")}
        >
          <Calendar className="h-4 w-4 mr-2" />
          Monthly Review
        </Button>
        <Button
          variant={activeTab === "save" ? "default" : "ghost"}
          className="flex-1 rounded-none"
          onClick={() => onTabChange("save")}
        >
          <TrendingDown className="h-4 w-4 mr-2" />
          Safe-to-Save
        </Button>
        <Button
          variant={activeTab === "deals" ? "default" : "ghost"}
          className="flex-1 rounded-none"
          onClick={() => onTabChange("deals")}
        >
          <Gift className="h-4 w-4 mr-2" />
          Deals
        </Button>
      </div>
    </div>
  )
}

// Subscription Table Component
interface SubscriptionTableProps {
  subscriptions: Subscription[]
  onCancel: (subscription: Subscription) => void
  onReschedule: (subscription: Subscription) => void
  onMarkLowUsage: (subscriptionId: string) => void
}

function SubscriptionTable({ subscriptions, onCancel, onReschedule, onMarkLowUsage }: SubscriptionTableProps) {
  const getFlagBadge = (flag: string) => {
    const variants = {
      duplicate: "destructive",
      overpriced: "destructive", 
      "low-usage": "secondary"
    } as const
    return <Badge variant={variants[flag as keyof typeof variants] || "outline"} className="text-xs">{flag}</Badge>
  }

  return (
    <div className="space-y-2">
      {subscriptions.map((subscription) => (
        <Card key={subscription.id}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="font-medium">{subscription.merchant}</h4>
                <p className="text-sm text-muted-foreground">
                  ${subscription.monthlyCost}/mo • Next: {new Date(subscription.nextChargeDate).toLocaleDateString()}
                </p>
              </div>
              <Badge variant="outline">{subscription.status}</Badge>
            </div>
            {subscription.flags.length > 0 && (
              <div className="flex gap-1 mb-3">
                {subscription.flags.map((flag) => (
                  <div key={flag}>{getFlagBadge(flag)}</div>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => onCancel(subscription)}>
                Cancel
              </Button>
              <Button size="sm" variant="outline" onClick={() => onReschedule(subscription)}>
                Reschedule
              </Button>
              <Button size="sm" variant="ghost" onClick={() => onMarkLowUsage(subscription.id)}>
                Mark low-usage
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Safe-to-Save Card Component
interface SafeToSaveCardProps {
  amount: number
  riskLevel: string
  onRiskChange: (level: string) => void
  onSafeToSave: (amount: number) => void
}

function SafeToSaveCard({ amount, riskLevel, onRiskChange, onSafeToSave }: SafeToSaveCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <h4 className="font-semibold mb-2">You can safely save ${amount}/week</h4>
        <div className="space-y-3">
          <div>
            <Label className="text-sm font-medium">Risk level</Label>
            <Select value={riskLevel} onValueChange={onRiskChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cautious">Cautious ($18)</SelectItem>
                <SelectItem value="normal">Normal ($24)</SelectItem>
                <SelectItem value="aggressive">Aggressive ($32)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p className="text-sm text-muted-foreground">
            Bills cluster Tue–Thu; this keeps a $25 buffer.
          </p>
          <div className="flex gap-2">
            <Button onClick={() => onSafeToSave(amount)} className="flex-1">
              Preview deposit (once)
            </Button>
            <Button variant="outline" className="flex-1">
              Schedule weekly
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="auto-pause" />
            <Label htmlFor="auto-pause" className="text-xs">Auto-pause on tight weeks</Label>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Deal Card Component
interface DealCardProps {
  offer: Offer
  onRedeem: (offer: Offer) => void
}

function DealCard({ offer, onRedeem }: DealCardProps) {
  const getTypeIcon = () => {
    switch (offer.type) {
      case "coupon": return <CreditCard className="h-4 w-4" />
      case "giftcard": return <Gift className="h-4 w-4" />
      case "cashback": return <TrendingDown className="h-4 w-4" />
      case "plan": return <Shield className="h-4 w-4" />
      default: return <Gift className="h-4 w-4" />
    }
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            {getTypeIcon()}
            <Badge variant="outline" className="text-xs">
              {offer.type === "giftcard" ? "Gift Card" : offer.type}
            </Badge>
          </div>
          <Badge variant="secondary" className="text-xs">
            {offer.estSavingsLabel}
          </Badge>
        </div>
        <h4 className="font-medium mb-1">{offer.label}</h4>
        <p className="text-sm text-muted-foreground mb-3">{offer.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{offer.sourceLabel}</span>
          <Button size="sm" onClick={() => onRedeem(offer)}>
            Redeem
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Dialog Components
interface RenameDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  agentName: string
  onAgentNameChange: (name: string) => void
  onRename: () => void
}

function RenameDialog({ open, onOpenChange, agentName, onAgentNameChange, onRename }: RenameDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename Agent</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="agent-name">Agent Name</Label>
            <Input
              id="agent-name"
              value={agentName}
              onChange={(e) => onAgentNameChange(e.target.value)}
              placeholder="e.g., Penny"
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={onRename} disabled={!agentName.trim()}>
              Rename
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface TemplatePreviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  subscription: Subscription | null
  onConfirm: (podId: string) => void
}

function TemplatePreviewDialog({ open, onOpenChange, subscription, onConfirm }: TemplatePreviewDialogProps) {
  const [selectedPod, setSelectedPod] = useState("1")

  if (!subscription) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancel {subscription.merchant}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Email Template</Label>
            <Textarea
              value={`Hi ${subscription.merchant} Team,

I would like to cancel my subscription effective immediately. 

Reason: Found a better alternative
Expected savings: $${subscription.monthlyCost}/month

Please confirm the cancellation and any final charges.

Thank you,
[Your Name]`}
              readOnly
              className="min-h-[120px]"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Copy className="h-4 w-4 mr-2" />
              Copy & continue
            </Button>
            <Button onClick={() => onConfirm(selectedPod)}>
              Record expected savings
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface RescheduleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  subscription: Subscription | null
  onConfirm: (podId: string) => void
}

function RescheduleDialog({ open, onOpenChange, subscription, onConfirm }: RescheduleDialogProps) {
  const [selectedPod, setSelectedPod] = useState("1")

  if (!subscription) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reschedule {subscription.merchant}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Reschedule Option</Label>
            <Select defaultValue="payday">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="payday">Move to payday</SelectItem>
                <SelectItem value="month-end">Move to month-end</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p className="text-sm text-muted-foreground">
            This will help avoid late fees and better align with your cash flow.
          </p>
          <div className="flex gap-2">
            <Button onClick={() => onConfirm(selectedPod)}>
              Record expected savings
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface SinkPodSelectorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pods: Pod[]
  onConfirm: (podId: string) => void
}

function SinkPodSelectorDialog({ open, onOpenChange, pods, onConfirm }: SinkPodSelectorDialogProps) {
  const [selectedPod, setSelectedPod] = useState("1")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Choose a sink pod</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            {pods.map((pod) => (
              <div
                key={pod.id}
                className={`p-3 border rounded-lg cursor-pointer ${
                  selectedPod === pod.id ? "border-primary bg-primary/5" : "border-muted"
                }`}
                onClick={() => setSelectedPod(pod.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{pod.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {Math.round((pod.currentAmount / pod.targetAmount) * 100)}% complete
                    </p>
                  </div>
                  <div className="text-sm font-medium">
                    ${pod.currentAmount.toLocaleString()} / ${pod.targetAmount.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full">
            Create new pod
          </Button>
          <p className="text-xs text-muted-foreground">
            Savings will be recorded into this pod.
          </p>
          <div className="flex gap-2">
            <Button onClick={() => onConfirm(selectedPod)}>
              Confirm
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface PreviewApplyDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  amount: number
  pods: Pod[]
  onConfirm: (podId: string) => void
}

function PreviewApplyDialog({ open, onOpenChange, amount, pods, onConfirm }: PreviewApplyDialogProps) {
  const [selectedPod, setSelectedPod] = useState("1")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Preview Deposit</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <Label className="text-muted-foreground">Amount</Label>
                <p className="font-semibold">${amount}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Pod</Label>
                <p className="font-semibold">{pods.find(p => p.id === selectedPod)?.name}</p>
              </div>
            </div>
            <div className="mt-3">
              <Label className="text-muted-foreground">Impact</Label>
              <p className="text-sm">
                Pod moves from {Math.round((pods.find(p => p.id === selectedPod)?.currentAmount || 0) / (pods.find(p => p.id === selectedPod)?.targetAmount || 1) * 100)}% → {Math.round(((pods.find(p => p.id === selectedPod)?.currentAmount || 0) + amount) / (pods.find(p => p.id === selectedPod)?.targetAmount || 1) * 100)}%
              </p>
            </div>
          </div>
          <div className="space-y-2">
            {pods.map((pod) => (
              <div
                key={pod.id}
                className={`p-3 border rounded-lg cursor-pointer ${
                  selectedPod === pod.id ? "border-primary bg-primary/5" : "border-muted"
                }`}
                onClick={() => setSelectedPod(pod.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{pod.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {Math.round((pod.currentAmount / pod.targetAmount) * 100)}% complete
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Button onClick={() => onConfirm(selectedPod)}>
              Apply
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
