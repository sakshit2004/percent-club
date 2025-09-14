import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  glow?: boolean
  variant?: "default" | "premium" | "subtle"
}

export function GlassCard({ 
  children, 
  className, 
  glow = false, 
  variant = "default" 
}: GlassCardProps) {
  const baseClasses = "backdrop-blur-xl border border-white/10"
  
  const variantClasses = {
    default: "bg-black/20",
    premium: "bg-gradient-to-br from-black/30 via-black/20 to-black/10",
    subtle: "bg-black/10"
  }
  
  const glowClasses = glow 
    ? "shadow-2xl shadow-emerald-500/10 ring-1 ring-emerald-500/20" 
    : "shadow-lg shadow-black/20"

  return (
    <Card className={cn(
      baseClasses,
      variantClasses[variant],
      glowClasses,
      className
    )}>
      {children}
    </Card>
  )
}
