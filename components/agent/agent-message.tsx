"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User } from "lucide-react"
import { formatRelativeTime } from "@/lib/format"
import Image from "next/image"

interface AgentMessageProps {
  role: "user" | "agent"
  text: string
  timestamp: string
  suggestions?: Array<{
    label: string
    action: string
  }>
  onSuggestionClick?: (action: string) => void
}

export function AgentMessage({ role, text, timestamp, suggestions, onSuggestionClick }: AgentMessageProps) {
  const isAgent = role === "agent"

  return (
    <div className={`flex gap-3 ${isAgent ? "" : "flex-row-reverse"}`}>
      <Avatar className="h-8 w-8 mt-1">
        <AvatarFallback className={isAgent ? "bg-primary text-primary-foreground" : "bg-muted"}>
          {isAgent ? <Image src="/Looniee-logo-main.svg" alt="Looniee AI" width={16} height={16} className="w-4 h-4 object-contain" /> : <User className="h-4 w-4" />}
        </AvatarFallback>
      </Avatar>

      <div className={`flex-1 max-w-[80%] ${isAgent ? "" : "flex flex-col items-end"}`}>
        <Card className={`${isAgent ? "bg-muted/50" : "bg-primary text-primary-foreground"}`}>
          <CardContent className="p-3">
            <p className="text-sm leading-relaxed">{text}</p>
          </CardContent>
        </Card>

        {suggestions && suggestions.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {suggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => onSuggestionClick?.(suggestion.action)}
                className="text-xs"
              >
                {suggestion.label}
              </Button>
            ))}
          </div>
        )}

        <div className={`text-xs text-muted-foreground mt-1 ${isAgent ? "" : "text-right"}`}>
          {formatRelativeTime(timestamp)}
        </div>
      </div>
    </div>
  )
}
