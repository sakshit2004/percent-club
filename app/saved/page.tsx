"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { 
  Bookmark, 
  Search, 
  ThumbsUp, 
  MessageCircle, 
  Share2,
  MoreHorizontal,
  UserPlus,
  UserMinus,
  Flag,
  EyeOff
} from "lucide-react"
import type { Post } from "@/types"

// Mock saved posts data
const mockSavedPosts: Post[] = [
  {
    id: "1",
    authorHandle: "savingsstar",
    authorAlias: "Sarah Chen",
    authorAvatar: "/diverse-woman-avatar.png",
    content: "Just hit 68% on my emergency fund goal! The round-up challenge has been a game changer. Small amounts really do add up over time.",
    tags: ["#roundups", "#milestone", "#emergency-fund"],
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
    content: "Pro tip: Set up your challenges to feed different pods based on priority. My round-ups go to emergency fund, weekly auto-save goes to vacation fund!",
    tags: ["#tips", "#strategy", "#challenges"],
    visibility: "public",
    reactions: 8,
    hasReacted: true,
    createdAt: "2024-01-14T09:15:00Z",
  },
  {
    id: "3",
    authorHandle: "goaldigger",
    authorAlias: "Emma Thompson",
    authorAvatar: "/woman-avatar-2.png",
    content: "Week 15 of the 52-week challenge complete! Already saved $120 and it's getting easier each week. Who else is doing this challenge?",
    tags: ["#52week", "#challenge", "#progress"],
    visibility: "public",
    reactions: 15,
    hasReacted: false,
    createdAt: "2024-01-13T16:20:00Z",
  },
  {
    id: "4",
    authorHandle: "frugalfriend",
    authorAlias: "Alex Kim",
    authorAvatar: "/diverse-person-avatars.png",
    content: "My AI agent found me $45 in subscription savings this month! Cancelled two services I forgot about and switched to a cheaper phone plan.",
    tags: ["#ai-agent", "#subscriptions", "#savings"],
    visibility: "public",
    reactions: 22,
    hasReacted: true,
    createdAt: "2024-01-12T11:45:00Z",
  },
]

export default function SavedPostsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [savedPosts, setSavedPosts] = useState(mockSavedPosts)
  const [isMobile, setIsMobile] = useState(false)
  const { toast } = useToast()

  // Check for mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleUnsave = (postId: string) => {
    setSavedPosts(prev => prev.filter(post => post.id !== postId))
    toast({
      title: "Post removed",
      description: "Post has been removed from your saved list.",
    })
  }

  const handleReact = (postId: string) => {
    setSavedPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            hasReacted: !post.hasReacted,
            reactions: post.hasReacted ? post.reactions - 1 : post.reactions + 1
          }
        : post
    ))
  }

  const handleFollow = (handle: string) => {
    toast({
      title: `You're now following @${handle}`,
      description: "You'll see their posts in your Following feed.",
    })
  }

  const handleUnfollow = (handle: string) => {
    toast({
      title: `Unfollowed @${handle}`,
      description: "You won't see their posts in your Following feed anymore.",
    })
  }

  const handleReport = (postId: string) => {
    toast({
      title: "Thanks, we'll review",
      description: "We've received your report and will look into it.",
    })
  }

  const handleHide = (postId: string) => {
    setSavedPosts(prev => prev.filter(post => post.id !== postId))
    toast({
      title: "Post removed from your feed",
      description: "This post has been hidden from your view.",
    })
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return "now"
    if (diffInHours < 24) return `${diffInHours}h`
    return `${Math.floor(diffInHours / 24)}d`
  }

  const filteredPosts = savedPosts.filter((post) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return post.content.toLowerCase().includes(query) || 
           post.tags.some(tag => tag.toLowerCase().includes(query)) ||
           post.authorAlias.toLowerCase().includes(query)
  })

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
          <Bookmark className="h-4 w-4 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Saved Posts</h1>
          <p className="text-muted-foreground">Your bookmarked tips and wins</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search saved posts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Posts Grid */}
      {filteredPosts.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post) => (
            <SavedPostCard
              key={post.id}
              post={post}
              onUnsave={handleUnsave}
              onReact={handleReact}
              onFollow={handleFollow}
              onUnfollow={handleUnfollow}
              onReport={handleReport}
              onHide={handleHide}
              formatTimeAgo={formatTimeAgo}
            />
          ))}
        </div>
      ) : (
        <Card className="rounded-2xl">
          <CardContent className="p-12 text-center">
            <Bookmark className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
            <h3 className="text-xl font-semibold mb-4">
              {searchQuery ? "No posts found" : "No saved posts yet"}
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery 
                ? "Try adjusting your search terms."
                : "Save useful tips to find them fast. Look for the bookmark icon on posts you want to save."
              }
            </p>
            {!searchQuery && (
              <Button>Explore Feed</Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Privacy Note */}
      <div className="mt-8 text-center">
        <p className="text-xs text-muted-foreground">
          Public shows % only. Balances stay private.
        </p>
      </div>
    </div>
  )
}

// Saved Post Card Component
interface SavedPostCardProps {
  post: Post
  onUnsave: (postId: string) => void
  onReact: (postId: string) => void
  onFollow: (handle: string) => void
  onUnfollow: (handle: string) => void
  onReport: (postId: string) => void
  onHide: (postId: string) => void
  formatTimeAgo: (dateString: string) => string
}

function SavedPostCard({ 
  post, 
  onUnsave, 
  onReact, 
  onFollow, 
  onUnfollow, 
  onReport, 
  onHide, 
  formatTimeAgo 
}: SavedPostCardProps) {
  const [isFollowing, setIsFollowing] = useState(false)

  const handleFollow = () => {
    setIsFollowing(!isFollowing)
    if (isFollowing) {
      onUnfollow(post.authorHandle)
    } else {
      onFollow(post.authorHandle)
    }
  }

  return (
    <Card className="rounded-2xl hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        {/* Author Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.authorAvatar} />
              <AvatarFallback>{post.authorAlias[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{post.authorAlias}</span>
                <Badge variant="outline" className="text-xs">L3</Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>@{post.authorHandle}</span>
                <span>•</span>
                <span>{formatTimeAgo(post.createdAt)}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onUnsave(post.id)}
              className="text-primary hover:text-primary"
            >
              <Bookmark className="h-4 w-4 fill-current" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleFollow}>
              {isFollowing ? <UserMinus className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onReport(post.id)}>
              <Flag className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Post Content */}
        <div className="mb-4">
          <p className="text-sm leading-relaxed">{post.content}</p>
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onReact(post.id)}
              className={post.hasReacted ? "text-primary" : ""}
            >
              <ThumbsUp className={`h-4 w-4 mr-2 ${post.hasReacted ? "fill-current" : ""}`} />
              {post.reactions}
            </Button>
            <Button variant="ghost" size="sm">
              <MessageCircle className="h-4 w-4 mr-2" />
              3
            </Button>
          </div>
          <Button variant="ghost" size="sm">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
