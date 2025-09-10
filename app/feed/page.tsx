"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PostComposer } from "@/components/social/post-composer"
import { PostItem } from "@/components/social/post-item"
import { useToast } from "@/hooks/use-toast"
import { Sparkles } from "lucide-react"
import type { Post } from "@/types"

// Mock data
const mockFeedPosts: Post[] = [
  {
    id: "1",
    authorHandle: "savingsstar",
    authorAlias: "Sarah Chen",
    authorAvatar: "/diverse-woman-avatar.png",
    content:
      "Just hit 68% on my emergency fund goal! The round-up challenge has been a game changer. Small amounts really do add up over time.",
    tags: ["milestone", "emergency-fund", "roundups"],
    visibility: "public",
    reactions: 12,
    hasReacted: false,
    createdAt: "2024-01-15T14:30:00Z",
  },
  {
    id: "2",
    authorHandle: "budgetboss",
    authorAlias: "Mike Rodriguez",
    authorAvatar: "/man-avatar.png",
    content:
      "Week 15 of the 52-week challenge complete! Already saved $120 and it's getting easier each week. Who else is doing this challenge?",
    tags: ["52-week", "challenge", "progress"],
    visibility: "public",
    reactions: 8,
    hasReacted: true,
    createdAt: "2024-01-15T11:20:00Z",
  },
  {
    id: "3",
    authorHandle: "goaldigger",
    authorAlias: "Emma Thompson",
    authorAvatar: "/woman-avatar-2.png",
    content:
      "My AI agent found me $45 in subscription savings this month! Cancelled two services I forgot about and switched to a cheaper phone plan.",
    tags: ["ai-agent", "subscriptions", "savings"],
    visibility: "public",
    reactions: 15,
    hasReacted: false,
    createdAt: "2024-01-15T09:45:00Z",
  },
  {
    id: "4",
    authorHandle: "frugalfriend",
    authorAlias: "Alex Kim",
    authorAvatar: "/diverse-person-avatars.png",
    content:
      "Vacation fund is at 85%! Thanks to everyone in the Challenge Champions community for the motivation. Two more months and I'm off to Japan! 🎌",
    tags: ["vacation", "goals", "community"],
    visibility: "followers",
    reactions: 22,
    hasReacted: false,
    createdAt: "2024-01-14T16:10:00Z",
  },
]

const mockUser = {
  avatar: "/diverse-user-avatars.png",
  alias: "You",
}

export default function FeedPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [filter, setFilter] = useState("all")
  const { toast } = useToast()

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

  const filteredPosts = mockFeedPosts.filter((post) => {
    if (filter === "communities") return post.tags.includes("community") || post.tags.includes("challenge")
    if (filter === "people") return !post.tags.includes("community")
    return true
  })

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
          <Sparkles className="h-4 w-4 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Feed</h1>
          <p className="text-muted-foreground">See what the community is up to</p>
        </div>
      </div>

      {/* Post Composer */}
      <div className="mb-8">
        <PostComposer
          userAvatar={mockUser.avatar}
          userAlias={mockUser.alias}
          onPost={handlePost}
          isLoading={isLoading}
        />
      </div>

      {/* Filter Tabs */}
      <Tabs value={filter} onValueChange={setFilter} className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Posts</TabsTrigger>
          <TabsTrigger value="communities">Communities</TabsTrigger>
          <TabsTrigger value="people">People</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filteredPosts.map((post) => (
            <PostItem key={post.id} post={post} onReact={handleReact} onShare={handleShare} />
          ))}
        </TabsContent>

        <TabsContent value="communities" className="space-y-4">
          {filteredPosts.map((post) => (
            <PostItem key={post.id} post={post} onReact={handleReact} onShare={handleShare} />
          ))}
        </TabsContent>

        <TabsContent value="people" className="space-y-4">
          {filteredPosts.map((post) => (
            <PostItem key={post.id} post={post} onReact={handleReact} onShare={handleShare} />
          ))}
        </TabsContent>
      </Tabs>

      {filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold mb-2">No posts yet</h3>
          <p className="text-muted-foreground mb-4">Follow some users or join communities to see posts in your feed.</p>
          <Button>Discover Communities</Button>
        </div>
      )}
    </div>
  )
}
