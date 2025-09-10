"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { CommunityCard } from "@/components/social/community-card"
import { useToast } from "@/hooks/use-toast"
import { Search, Users } from "lucide-react"
import type { Community } from "@/types"

// Mock data
const mockCommunities: Community[] = [
  {
    id: "1",
    name: "Emergency Fund Heroes",
    description:
      "Building emergency funds together, one dollar at a time. Share your progress, get motivated, and learn from others who've successfully built their safety net.",
    membersCount: 1234,
    isJoined: false,
    avatar: "/emergency-fund-icon.png",
  },
  {
    id: "2",
    name: "Challenge Champions",
    description:
      "Masters of savings challenges and automation. From 52-week challenges to round-ups, we're here to gamify your savings journey.",
    membersCount: 567,
    isJoined: true,
    avatar: "/challenge-icon.jpg",
  },
  {
    id: "3",
    name: "Vacation Savers",
    description:
      "Planning your next adventure? Join fellow travelers who are saving smart for their dream trips. Share destinations, deals, and savings strategies.",
    membersCount: 892,
    isJoined: false,
    avatar: "/vacation-icon.png",
  },
  {
    id: "4",
    name: "First-Time Savers",
    description:
      "New to saving? This supportive community is perfect for beginners. Get tips, ask questions, and celebrate your first milestones with us.",
    membersCount: 2156,
    isJoined: false,
    avatar: "/beginner-icon.jpg",
  },
  {
    id: "5",
    name: "AI Agent Power Users",
    description:
      "Get the most out of your AI savings assistant. Share tips, tricks, and success stories about subscription reviews, deal finding, and smart saving suggestions.",
    membersCount: 445,
    isJoined: true,
    avatar: "/ai-icon.png",
  },
  {
    id: "6",
    name: "Goal Crushers",
    description:
      "For serious savers with ambitious goals. Whether it's a house down payment, debt payoff, or early retirement, we're here to help you crush your financial goals.",
    membersCount: 678,
    isJoined: false,
    avatar: "/goal-icon.png",
  },
]

export default function CommunitiesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()

  const handleJoin = (communityId: string) => {
    const community = mockCommunities.find((c) => c.id === communityId)
    toast({
      title: "Joined Community",
      description: `Welcome to ${community?.name}! You'll now see posts from this community in your feed.`,
    })
  }

  const handleLeave = (communityId: string) => {
    const community = mockCommunities.find((c) => c.id === communityId)
    toast({
      title: "Left Community",
      description: `You've left ${community?.name}. You can rejoin anytime.`,
    })
  }

  const filteredCommunities = mockCommunities.filter(
    (community) =>
      community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      community.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const joinedCommunities = filteredCommunities.filter((c) => c.isJoined)
  const availableCommunities = filteredCommunities.filter((c) => !c.isJoined)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
          <Users className="h-4 w-4 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Communities</h1>
          <p className="text-muted-foreground">Connect with like-minded savers</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search communities..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Joined Communities */}
      {joinedCommunities.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Your Communities ({joinedCommunities.length})</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {joinedCommunities.map((community) => (
              <CommunityCard key={community.id} community={community} onJoin={handleJoin} onLeave={handleLeave} />
            ))}
          </div>
        </div>
      )}

      {/* Available Communities */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          {joinedCommunities.length > 0 ? "Discover More" : "All Communities"} ({availableCommunities.length})
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {availableCommunities.map((community) => (
            <CommunityCard key={community.id} community={community} onJoin={handleJoin} onLeave={handleLeave} />
          ))}
        </div>
      </div>

      {filteredCommunities.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold mb-2">No communities found</h3>
          <p className="text-muted-foreground">Try adjusting your search terms.</p>
        </div>
      )}
    </div>
  )
}
