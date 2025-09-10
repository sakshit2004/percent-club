"use client"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { CommunityCard } from "@/components/social/community-card"
import { PostItem } from "@/components/social/post-item"
import { Leaderboard } from "@/components/social/leaderboard"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Users } from "lucide-react"
import Link from "next/link"
import type { Community, Post, LeaderboardEntry } from "@/types"

// Mock data
const mockCommunity: Community = {
  id: "1",
  name: "Emergency Fund Heroes",
  description:
    "Building emergency funds together, one dollar at a time. Share your progress, get motivated, and learn from others who've successfully built their safety net. We believe that everyone deserves financial security, and we're here to support each other on this journey.",
  membersCount: 1234,
  isJoined: false,
  avatar: "/emergency-fund-icon.png",
}

const mockPosts: Post[] = [
  {
    id: "1",
    authorHandle: "savingsstar",
    authorAlias: "Sarah Chen",
    authorAvatar: "/diverse-woman-avatar.png",
    content:
      "Just hit 68% on my emergency fund goal! The round-up challenge has been a game changer for building this safety net.",
    tags: ["milestone", "emergency-fund", "roundups"],
    visibility: "public",
    reactions: 12,
    hasReacted: false,
    createdAt: "2024-01-15T14:30:00Z",
  },
  {
    id: "2",
    authorHandle: "steadysaver",
    authorAlias: "David Park",
    authorAvatar: "/man-avatar-2.png",
    content:
      "Reminder: Your emergency fund should cover 3-6 months of expenses. Don't get discouraged if it takes time to build - every dollar counts!",
    tags: ["tips", "emergency-fund", "motivation"],
    visibility: "public",
    reactions: 18,
    hasReacted: true,
    createdAt: "2024-01-15T10:15:00Z",
  },
]

const mockLeaderboard: LeaderboardEntry[] = [
  {
    rank: 1,
    handle: "emergencyace",
    alias: "Lisa Wong",
    avatar: "/woman-avatar-3.png",
    progress: 95,
    streak: 45,
  },
  {
    rank: 2,
    handle: "savingsstar",
    alias: "Sarah Chen",
    avatar: "/diverse-woman-avatar.png",
    progress: 68,
    streak: 30,
  },
  {
    rank: 3,
    handle: "steadysaver",
    alias: "David Park",
    avatar: "/man-avatar-2.png",
    progress: 52,
    streak: 28,
  },
]

export default function CommunityDetailPage() {
  const params = useParams()
  const communityId = params.id as string
  const { toast } = useToast()

  const handleJoin = (communityId: string) => {
    toast({
      title: "Joined Community",
      description: `Welcome to ${mockCommunity.name}! You'll now see posts from this community in your feed.`,
    })
  }

  const handleLeave = (communityId: string) => {
    toast({
      title: "Left Community",
      description: `You've left ${mockCommunity.name}. You can rejoin anytime.`,
    })
  }

  const handleReact = (postId: string) => {
    toast({
      title: "Reaction Added",
      description: "You liked this post!",
    })
  }

  const handleShare = (postId: string) => {
    toast({
      title: "Post Shared",
      description: "Post copied to clipboard!",
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/communities">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Communities
          </Link>
        </Button>
      </div>

      {/* Community Info */}
      <div className="mb-8">
        <CommunityCard community={mockCommunity} onJoin={handleJoin} onLeave={handleLeave} showDescription={false} />
        <div className="mt-4 p-4 bg-muted/20 rounded-lg">
          <p className="text-sm leading-relaxed">{mockCommunity.description}</p>
        </div>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="posts" className="space-y-6">
        <TabsList>
          <TabsTrigger value="posts">
            Posts
            <Badge variant="secondary" className="ml-2">
              {mockPosts.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="leaderboard">
            Leaderboard
            <Badge variant="secondary" className="ml-2">
              {mockLeaderboard.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="space-y-4">
          {mockPosts.map((post) => (
            <PostItem key={post.id} post={post} onReact={handleReact} onShare={handleShare} />
          ))}

          {mockPosts.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">No posts yet</h3>
              <p className="text-muted-foreground">Be the first to share something with this community!</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="leaderboard">
          <Leaderboard entries={mockLeaderboard} title="Top Savers This Month" type="progress" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
