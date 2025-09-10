"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { AlertTriangle, DollarSign, TrendingDown, Calendar } from "lucide-react"
import type { Subscription } from "@/types"
import { formatCurrency, formatDate } from "@/lib/format"

interface SubscriptionListProps {
  subscriptions: Subscription[]
  onCancel?: (subscriptionId: string, reason: string) => void
  onReschedule?: (subscriptionId: string, newDate: string) => void
}

const flagIcons = {
  duplicate: AlertTriangle,
  overpriced: DollarSign,
  "low-usage": TrendingDown,
}

const flagColors = {
  duplicate: "text-warning",
  overpriced: "text-destructive",
  "low-usage": "text-info",
}

const flagLabels = {
  duplicate: "Duplicate",
  overpriced: "Overpriced",
  "low-usage": "Low Usage",
}

export function SubscriptionList({ subscriptions, onCancel, onReschedule }: SubscriptionListProps) {
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [selectedSubscription, setSelectedSubscription] = useState<string>("")
  const [cancelReason, setCancelReason] = useState("")

  const handleCancelClick = (subscriptionId: string) => {
    setSelectedSubscription(subscriptionId)
    setCancelDialogOpen(true)
  }

  const handleConfirmCancel = () => {
    if (selectedSubscription && onCancel) {
      onCancel(selectedSubscription, cancelReason)
      setCancelDialogOpen(false)
      setCancelReason("")
      setSelectedSubscription("")
    }
  }

  if (subscriptions.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="font-semibold mb-2">No subscriptions found</h3>
          <p className="text-sm text-muted-foreground text-center">
            Connect your accounts to get personalized subscription insights.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {subscriptions.map((subscription) => (
        <Card key={subscription.id}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium">{subscription.merchant}</h4>
                  <Badge
                    variant={subscription.status === "active" ? "secondary" : "outline"}
                    className={subscription.status === "active" ? "bg-success/10 text-success" : ""}
                  >
                    {subscription.status}
                  </Badge>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{formatCurrency(subscription.monthlyCost)}/month</span>
                  <span>Next: {formatDate(subscription.nextChargeDate)}</span>
                </div>

                {subscription.flags.length > 0 && (
                  <div className="flex gap-2 mt-2">
                    {subscription.flags.map((flag) => {
                      const Icon = flagIcons[flag]
                      const colorClass = flagColors[flag]
                      const label = flagLabels[flag]

                      return (
                        <Badge key={flag} variant="outline" className="gap-1">
                          <Icon className={`h-3 w-3 ${colorClass}`} />
                          <span className="text-xs">{label}</span>
                        </Badge>
                      )
                    })}
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleCancelClick(subscription.id)}>
                  Cancel
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onReschedule?.(subscription.id, subscription.nextChargeDate)}
                >
                  Reschedule
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Cancel Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Subscription</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Tell us why you want to cancel this subscription. This helps us provide better recommendations.
            </p>

            <Textarea
              placeholder="e.g., Not using it enough, found a better alternative, too expensive..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={handleConfirmCancel} disabled={!cancelReason.trim()}>
              Cancel Subscription
            </Button>
            <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
              Keep Subscription
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
