"use client"

import { useEffect, useState } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { cn } from "@/lib/utils"

interface FloatingChipProps {
  children: React.ReactNode
  delay?: number
  className?: string
  variant?: "success" | "info" | "warning"
}

export function FloatingChip({ 
  children, 
  delay = 0, 
  className,
  variant = "success"
}: FloatingChipProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay])

  const variantClasses = {
    success: "border-emerald-500/30 bg-emerald-500/5",
    info: "border-blue-500/30 bg-blue-500/5", 
    warning: "border-amber-500/30 bg-amber-500/5"
  }

  return (
    <div
      className={cn(
        "transition-all duration-700 ease-out",
        isVisible 
          ? "opacity-100 translate-y-0" 
          : "opacity-0 translate-y-4",
        className
      )}
    >
      <GlassCard 
        className={cn(
          "p-3 text-sm font-medium text-white/90 backdrop-blur-md",
          variantClasses[variant],
          className
        )}
        variant="subtle"
      >
        {children}
      </GlassCard>
    </div>
  )
}
