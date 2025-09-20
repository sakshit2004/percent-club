"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Bot, Users, Shield, MessageCircle, Smartphone, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/ui/glass-card"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import Image from "next/image"

interface CommunityInviteModalProps {
  challengeName: string
  communityName: string
  children: React.ReactNode
}

const channelOptions = [
  {
    id: "app",
    name: "In-App",
    icon: MessageCircle,
    description: "Get notifications in the app",
    color: "emerald"
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    icon: MessageCircle,
    description: "Receive messages on WhatsApp",
    color: "green"
  },
  {
    id: "sms",
    name: "SMS",
    icon: Smartphone,
    description: "Get text message updates",
    color: "blue"
  },
  {
    id: "call",
    name: "Phone Call",
    icon: Phone,
    description: "Receive a personal call",
    color: "purple"
  }
]

export function CommunityInviteModal({ challengeName, communityName, children }: CommunityInviteModalProps) {
  const [selectedChannels, setSelectedChannels] = useState<string[]>(["app"])
  const [isOpen, setIsOpen] = useState(false)

  const toggleChannel = (channelId: string) => {
    setSelectedChannels(prev => 
      prev.includes(channelId) 
        ? prev.filter(id => id !== channelId)
        : [...prev, channelId]
    )
  }

  const handleInvite = () => {
    // Here you would trigger the actual Lonniee invitation flow
    console.log("Inviting via channels:", selectedChannels)
    setIsOpen(false)
    // Show success message or redirect
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl bg-black/95 backdrop-blur-xl border-white/10 p-0">
        <div className="relative">
          {/* Header */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                  <Image 
                    src="/Looniee-logo-main.svg" 
                    alt="Lonniee" 
                    width={20} 
                    height={20}
                    className="w-5 h-5"
                  />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Join Challenge Privately</h2>
                  <p className="text-sm text-white/60">Lonniee will invite you personally</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-white/60 hover:text-white hover:bg-white/5"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Challenge Info */}
            <GlassCard className="p-4" glow variant="premium">
              <div className="flex items-center gap-3 mb-3">
                <Users className="h-5 w-5 text-blue-400" />
                <div>
                  <h3 className="font-semibold text-white">{challengeName}</h3>
                  <p className="text-sm text-white/60">in {communityName}</p>
                </div>
              </div>
              <p className="text-sm text-white/70">
                This challenge will help you save money through small, achievable actions. 
                Lonniee will track your progress privately and only share % completion with the community.
              </p>
            </GlassCard>

            {/* How it works */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">How it works:</h3>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-emerald-400 text-xs font-bold">1</span>
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Lonniee sends you a private invitation</p>
                    <p className="text-white/60 text-xs">Choose how you want to receive the invite</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-emerald-400 text-xs font-bold">2</span>
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">You review and approve the challenge</p>
                    <p className="text-white/60 text-xs">See exactly what Lonniee will track before agreeing</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-emerald-400 text-xs font-bold">3</span>
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Lonniee tracks your progress privately</p>
                    <p className="text-white/60 text-xs">Only % completion is shared with the community</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Channel Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">How should Lonniee contact you?</h3>
              <div className="grid grid-cols-2 gap-3">
                {channelOptions.map((channel) => {
                  const IconComponent = channel.icon
                  const isSelected = selectedChannels.includes(channel.id)
                  
                  return (
                    <button
                      key={channel.id}
                      onClick={() => toggleChannel(channel.id)}
                      className={`p-3 rounded-lg border transition-all ${
                        isSelected 
                          ? `border-${channel.color}-500/50 bg-${channel.color}-500/10` 
                          : 'border-white/10 bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <IconComponent className={`h-4 w-4 ${isSelected ? `text-${channel.color}-400` : 'text-white/60'}`} />
                        <span className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-white/80'}`}>
                          {channel.name}
                        </span>
                      </div>
                      <p className="text-xs text-white/60 text-left">{channel.description}</p>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Privacy Notice */}
            <GlassCard className="p-4 border-l-4 border-emerald-400" glow>
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-semibold text-white mb-1">Privacy Protected</h4>
                  <p className="text-xs text-white/70">
                    Lonniee is private to you. Communities only see your alias and % progress in public challenges. 
                    Your personal financial data stays secure and private.
                  </p>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-white/10 flex gap-3">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1 border-white/20 text-white hover:bg-white/5"
            >
              Cancel
            </Button>
            <Button
              onClick={handleInvite}
              disabled={selectedChannels.length === 0}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Bot className="mr-2 h-4 w-4" />
              Get Invited by Lonniee
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
