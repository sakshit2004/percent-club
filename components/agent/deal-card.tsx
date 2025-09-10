"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Gift, CreditCard, Percent, Zap } from "lucide-react"
import type { Offer } from "@/types"

interface DealCardProps {
  offer: Offer
  onRedeem: (offerId: string) => void
}

const offerIcons = {
  coupon: Percent,
  giftcard: Gift,
  cashback: CreditCard,
  plan: Zap,
}

const offerColors = {
  coupon: "bg-warning/10 text-warning border-warning/20",
  giftcard: "bg-success/10 text-success border-success/20",
  cashback: "bg-info/10 text-info border-info/20",
  plan: "bg-primary/10 text-primary border-primary/20",
}

export function DealCard({ offer, onRedeem }: DealCardProps) {
  const Icon = offerIcons[offer.type]
  const colorClass = offerColors[offer.type]

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg ${colorClass}`}>
            <Icon className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-base">{offer.label}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{offer.sourceLabel}</p>
          </div>
          <Badge variant="outline" className="bg-success/10 text-success border-success/20">
            {offer.estSavingsLabel}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {offer.description && <p className="text-sm text-muted-foreground leading-relaxed">{offer.description}</p>}

        {offer.expiresAt && (
          <div className="text-xs text-muted-foreground">Expires: {new Date(offer.expiresAt).toLocaleDateString()}</div>
        )}

        <Button onClick={() => onRedeem(offer.id)} className="w-full">
          Redeem Deal
        </Button>
      </CardContent>
    </Card>
  )
}
