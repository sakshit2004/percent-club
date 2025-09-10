"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileHeader } from "@/components/profile/profile-header"
import { BadgeGrid } from "@/components/profile/badge-grid"
import { PostComposer } from "@/components/social/post-composer"
import { PostItem } from "@/components/social/post-item"
import { CommunityCard } from "@/components/social/community-card"
import { useToast } from "@/hooks/use-toast"
import type { Profile, Post, Community } from "@/types"

// Mock data
const mockProfile: Profile = {
  id: "1",
  handle: "savingsstar",
  alias: "Sarah Chen",
  avatar: "/diverse-woman-avatar.png",
  level: 12,
  xp: 2450,
  badges: ["first-pod", "streak-30", "saver-1000", "challenger", "social-butterfly"],
  followersCount: 234,
  followingCount: 89,
  isFollowing: false,
  featuredPodId: "1",
  featuredPodProgress: 68,
}

const mockPosts: Post[] = [
  {
    id: "1",
    authorHandle: "savingsstar",
    authorAlias: "Sarah Chen",
    authorAvatar: "/diverse-woman-avatar.png",
    content:
      "Just hit 68% on my emergency fund goal! The round-up challenge has been a game changer. Small amounts really do add up over time. 💪",
    tags: ["milestone", "emergency-fund", "roundups"],
    visibility: "public",
    reactions: 12,
    hasReacted: false,
    createdAt: "2024-01-15T14:30:00Z",
  },
  {
    id: "2",
    authorHandle: "savingsstar",
    authorAlias: "Sarah Chen",
    authorAvatar: "/diverse-woman-avatar.png",
    content:
      "Pro tip: Set up your challenges to feed different pods based on priority. My round-ups go to emergency fund, weekly auto-save goes to vacation fund!",
    tags: ["tips", "strategy", "challenges"],
    visibility: "public",
    reactions: 8,
    hasReacted: false,
    createdAt: "2024-01-14T09:15:00Z",
  },
]

const mockCommunities: Community[] = [
  {
    id: "1",
    name: "Emergency Fund Heroes",
    description: "Building emergency funds together, one dollar at a time",
    membersCount: 1234,
    isJoined: true,
  },
  {
    id: "2",
    name: "Challenge Champions",
    description: "Masters of savings challenges and automation",
    membersCount: 567,
    isJoined: true,
  },
]

export default function ProfilePage() {
  const params = useParams()
  const handle = params.handle as string
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  // In a real app, you'd fetch the profile based on the handle
  const isOwnProfile = handle === "me" // Mock logic

  const handleFollow = (profileId: string) => {
    toast({
      title: "Followed",
      description: `You are now following ${mockProfile.alias}`,
    })
  }

  const handleUnfollow = (profileId: string) => {
    toast({
      title: "Unfollowed",
      description: `You unfollowed ${mockProfile.alias}`,
    })
  }

  const handlePost = (content: string, tags: string[], visibility: "public" | "followers") => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Post Created",
        description: "Your post has been shared with the community!",
      })
      setIsLoading(false)
    }, 1000)
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
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Profile Header */}
      <ProfileHeader
        profile={mockProfile}
        isOwnProfile={isOwnProfile}
        onFollow={handleFollow}
        onUnfollow={handleUnfollow}
      />

      {/* Content Tabs */}
      <Tabs defaultValue="posts" className="space-y-6">
        <TabsList>
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
          <TabsTrigger value="communities">Communities</TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="space-y-6">
          {isOwnProfile && (
            <PostComposer
              userAvatar={mockProfile.avatar}
              userAlias={mockProfile.alias}
              onPost={handlePost}
              isLoading={isLoading}
            />
          )}

          <div className="space-y-4">
            {mockPosts.map((post) => (
              <PostItem key={post.id} post={post} onReact={handleReact} onShare={handleShare} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="badges">
          <BadgeGrid badges={mockProfile.badges} />
        </TabsContent>

        <TabsContent value="communities">
          <div className="space-y-4">
            {mockCommunities.map((community) => (
              <CommunityCard key={community.id} community={community} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
