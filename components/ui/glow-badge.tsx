import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface GlowBadgeProps {
  children: React.ReactNode
  className?: string
  variant?: "emerald" | "blue" | "purple" | "amber"
  size?: "sm" | "md" | "lg"
}

export function GlowBadge({ 
  children, 
  className, 
  variant = "emerald",
  size = "md"
}: GlowBadgeProps) {
  const variantClasses = {
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-500/20",
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-blue-500/20",
    purple: "bg-purple-500/10 text-purple-400 border-purple-500/20 shadow-purple-500/20",
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-amber-500/20"
  }
  
  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-1.5",
    lg: "text-base px-4 py-2"
  }

  return (
    <Badge 
      className={cn(
        "backdrop-blur-sm border shadow-lg",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {children}
    </Badge>
  )
}
