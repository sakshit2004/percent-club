"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { AgentMessage } from "./agent-message"
import { Send, Loader2 } from "lucide-react"

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

interface AgentChatProps {
  messages: ChatMessage[]
  onSendMessage: (message: string) => void
  onSuggestionClick: (action: string) => void
  isLoading?: boolean
  agentName?: string
}

export function AgentChat({
  messages,
  onSendMessage,
  onSuggestionClick,
  isLoading = false,
  agentName = "Sage",
}: AgentChatProps) {
  const [inputValue, setInputValue] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue.trim())
      setInputValue("")
    }
  }

  const handleSuggestionClick = (action: string) => {
    onSuggestionClick(action)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b p-4">
        <h2 className="font-semibold">Chat with {agentName}</h2>
        <p className="text-sm text-muted-foreground">Your AI savings assistant</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <div className="text-center">
                <h3 className="font-semibold mb-2">Hi! I'm {agentName}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  I'm here to help you save more and spend smarter. Ask me about your subscriptions, savings goals, or
                  deals!
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Button variant="outline" size="sm" onClick={() => handleSuggestionClick("review-subscriptions")}>
                    Review my subscriptions
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleSuggestionClick("safe-to-save")}>
                    How much can I save?
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleSuggestionClick("find-deals")}>
                    Find me deals
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          messages.map((message) => (
            <AgentMessage
              key={message.id}
              role={message.role}
              text={message.text}
              timestamp={message.timestamp}
              suggestions={message.suggestions}
              onSuggestionClick={handleSuggestionClick}
            />
          ))
        )}

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

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={`Ask ${agentName} anything...`}
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
