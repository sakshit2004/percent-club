"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/ui/glass-card"
import { Check, X } from "lucide-react"

interface ApprovalPreviewProps {
  title: string
  description: string
  amount?: string
  onApprove?: () => void
  onCancel?: () => void
  className?: string
}

export function ApprovalPreview({
  title,
  description,
  amount,
  onApprove,
  onCancel,
  className
}: ApprovalPreviewProps) {
  const [isVisible, setIsVisible] = useState(true)

  const handleApprove = () => {
    onApprove?.()
    setIsVisible(false)
  }

  const handleCancel = () => {
    onCancel?.()
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <GlassCard 
      className={`animate-in slide-in-from-bottom-4 duration-300 ${className}`}
      glow
    >
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h4 className="font-semibold text-white">{title}</h4>
            <p className="text-sm text-gray-300">{description}</p>
            {amount && (
              <p className="text-emerald-400 font-medium">{amount}</p>
            )}
          </div>
        </div>
        
        <div className="flex gap-2 pt-2">
          <Button 
            size="sm" 
            onClick={handleApprove}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <Check className="h-4 w-4 mr-1" />
            Approve
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleCancel}
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            <X className="h-4 w-4 mr-1" />
            Cancel
          </Button>
        </div>
      </div>
    </GlassCard>
  )
}
