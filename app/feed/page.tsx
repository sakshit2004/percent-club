"use client"

import * as React from "react"
import { useState, useEffect, useMemo, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { 
  Sparkles, 
  Search, 
  Send, 
  ThumbsUp, 
  MessageCircle, 
  Bookmark, 
  MoreHorizontal,
  Plus,
  TrendingUp,
  Users,
  UserPlus,
  UserMinus,
  Flag,
  Eye,
  EyeOff,
  Heart,
  Share2
} from "lucide-react"
import type { Community, Pod } from "@/types"
import {
  getHomeFeedFull,
  listCommunities,
  getMyJoinedCommunityIds,
  getCommunityMemberCounts,
  joinCommunity,
  leaveCommunity,
  createPost as createSocialPost,
  likePost,
  unlikePost,
  subscribeRealtime,
  heartbeatPresence,
  getCommentsFull,
  addComment,
  type FeedItem,
  type CommentWithAuthor,
} from "@/lib/social"
import { createClient } from "@/lib/supabase/client"
import { usePods } from "@/lib/api"

type UIPost = {
  id: string
  authorHandle: string
  authorAlias: string
  authorAvatar?: string
  content: string
  tags: string[]
  visibility: "public" | "followers"
  reactions: number
  hasReacted: boolean
  createdAt: string
}

type SuggestedCommunity = Community

type Me = { avatar?: string; alias: string; handle: string }

export default function FeedPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [filter, setFilter] = useState("foryou")
  const [sort, setSort] = useState("top")
  const [searchQuery, setSearchQuery] = useState("")
  const [posts, setPosts] = useState<UIPost[]>([])
  const [pendingPosts, setPendingPosts] = useState<UIPost[]>([])
  const [me, setMe] = useState<Me | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [commentsOpen, setCommentsOpen] = useState<string | null>(null)
  const { toast } = useToast()
  const supabase = createClient()
  const { data: podsData } = usePods()
  const [suggestedCommunities, setSuggestedCommunities] = useState<SuggestedCommunity[]>([])

  // Map FeedItem -> UIPost
  const toUIPost = useCallback((item: FeedItem): UIPost => ({
    id: item.post.id,
    authorHandle: item.author.handle,
    authorAlias: item.author.name || item.author.handle,
    authorAvatar: item.author.avatar_url || "/placeholder.svg",
    content: item.post.text,
    tags: [],
    visibility: item.post.visibility,
    reactions: item.likesCount,
    hasReacted: item.likedByMe,
    createdAt: item.post.created_at,
  }), [])

  // Check for mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Load me (alias/handle/avatar)
  useEffect(() => {
    let active = true
    ;(async () => {
      const { data: u } = await supabase.auth.getUser()
      if (!u.user) return
      const { data: profile } = await supabase
        .from("profiles")
        .select("handle,name,avatar_url")
        .eq("id", u.user.id)
        .single()
      if (!active) return
      setMe({
        handle: profile?.handle || u.user.id.slice(0, 6),
        alias: profile?.name || profile?.handle || "You",
        avatar: profile?.avatar_url || "/placeholder-user.jpg",
      })
    })()
    return () => { active = false }
  }, [supabase])

  // Initial feed load
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const items = await getHomeFeedFull(50)
      if (!cancelled) setPosts(items.map(toUIPost))
    })()
    return () => { cancelled = true }
  }, [toUIPost])

  // Load community suggestions (top by membersCount)
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const base = await listCommunities(50)
        const joined = await getMyJoinedCommunityIds()
        const counts = await getCommunityMemberCounts(base.map((c: any) => c.id))
        if (cancelled) return
        const mapped: SuggestedCommunity[] = base
          .map((c: any) => ({
            id: c.id,
            name: c.title,
            description: c.description || "",
            membersCount: counts[c.id] ?? 0,
            isJoined: joined.has(c.id),
            avatar: c.cover_url || "/placeholder.svg",
          }))
          .sort((a, b) => (b.membersCount - a.membersCount))
        setSuggestedCommunities(mapped)
      } catch {}
    })()
    return () => { cancelled = true }
  }, [])

  const handleJoinCommunity = async (communityId: string) => {
    setSuggestedCommunities(prev => prev.map(c => c.id === communityId ? { ...c, isJoined: true } : c))
    try { await joinCommunity(communityId) } catch {}
  }
  const handleLeaveCommunity = async (communityId: string) => {
    setSuggestedCommunities(prev => prev.map(c => c.id === communityId ? { ...c, isJoined: false } : c))
    try { await leaveCommunity(communityId) } catch {}
  }

  // Presence heartbeat
  useEffect(() => {
    const id = setInterval(() => { heartbeatPresence().catch(() => {}) }, 30000)
    heartbeatPresence().catch(() => {})
    return () => clearInterval(id)
  }, [])

  // Realtime subscriptions
  useEffect(() => {
    const unsubscribe = subscribeRealtime({
      posts: (payload) => {
        if (payload.eventType === "INSERT") {
          const item = payload.new
          const mapped: UIPost = {
            id: item.id,
            authorHandle: "", // will be enriched on next refresh; quick insert at top
            authorAlias: "",
            authorAvatar: "/placeholder.svg",
            content: item.text,
            tags: [],
            visibility: item.visibility,
            reactions: 0,
            hasReacted: false,
            createdAt: item.created_at,
          }
          setPendingPosts(prev => [mapped, ...prev])
        }
        if (payload.eventType === "DELETE") {
          const item = payload.old
          // Remove from both live and pending buffers
          setPosts(prev => prev.filter(p => p.id !== item.id))
          setPendingPosts(prev => prev.filter(p => p.id !== item.id))
        }
      },
      post_likes: (payload) => {
        const postId = (payload.new?.post_id || payload.old?.post_id) as string
        const delta = payload.eventType === "INSERT" ? 1 : payload.eventType === "DELETE" ? -1 : 0
        if (!postId || delta === 0) return
        setPosts(prev => prev.map(p => p.id === postId ? { ...p, reactions: Math.max(0, p.reactions + delta) } : p))
      },
    })
    return () => { unsubscribe() }
  }, [])

  const mergePendingPosts = () => {
    if (!pendingPosts.length) return
    setPosts(prev => {
      const existingIds = new Set(prev.map(p => p.id))
      const uniquePending = pendingPosts.filter(p => !existingIds.has(p.id))
      return [...uniquePending, ...prev]
    })
    setPendingPosts([])
  }

  const handlePost = async (
    content: string,
    _tags: string[],
    visibility: "public" | "followers" | "community",
    communityId?: string,
  ) => {
    setIsLoading(true)
    const optimistic: UIPost | null = me ? {
      id: `temp-${Date.now()}`,
      authorHandle: me.handle,
      authorAlias: me.alias,
      authorAvatar: me.avatar,
      content,
      tags: [],
      visibility: visibility === "community" ? "public" : visibility,
      reactions: 0,
      hasReacted: false,
      createdAt: new Date().toISOString(),
    } : null
    if (optimistic) setPosts(prev => [optimistic, ...prev])
    try {
      const created = await createSocialPost({ text: content, visibility: visibility === "community" ? "public" : visibility, community_id: visibility === "community" ? (communityId || null) : null })
      setPosts(prev => [
        {
          id: created.id,
          authorHandle: me?.handle || "",
          authorAlias: me?.alias || "",
          authorAvatar: me?.avatar,
          content: created.text,
          tags: [],
          visibility: created.visibility,
          reactions: 0,
          hasReacted: false,
          createdAt: created.created_at,
        },
        ...prev.filter(p => p.id !== optimistic?.id),
      ])
      toast({ title: "Posted — nice one!", description: "Your post has been shared." })
    } catch (e: any) {
      // rollback
      if (optimistic) setPosts(prev => prev.filter(p => p.id !== optimistic.id))
      toast({ title: "Couldn't post", description: e?.message || "Please try again.", variant: "destructive" as any })
    } finally {
      setIsLoading(false)
    }
  }

  const handleReact = async (postId: string) => {
    const target = posts.find(p => p.id === postId)
    if (!target) return
    const nextLiked = !target.hasReacted
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, hasReacted: nextLiked, reactions: Math.max(0, p.reactions + (nextLiked ? 1 : -1)) } : p))
    try {
      if (nextLiked) await likePost(postId)
      else await unlikePost(postId)
    } catch {
      // rollback
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, hasReacted: !nextLiked, reactions: Math.max(0, p.reactions + (!nextLiked ? 1 : -1)) } : p))
    }
  }

  const handleSave = (postId: string) => {
    toast({
      title: "Saved to your list",
      description: "Post has been bookmarked.",
    })
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
    setPosts(prev => prev.filter(post => post.id !== postId))
    toast({
      title: "Post removed from your feed",
      description: "This post has been hidden from your view.",
    })
  }

  const handleDelete = (postId: string) => {
    setPosts(prev => prev.filter(post => post.id !== postId))
    toast({
      title: "Post deleted",
      description: "Your post has been removed.",
    })
  }

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        if (!post.content.toLowerCase().includes(query) && 
            !post.tags.some(tag => tag.toLowerCase().includes(query)) &&
            !post.authorAlias.toLowerCase().includes(query)) {
          return false
        }
      }

      // Filter by type
      if (filter === "following") {
        // In real app, this would check if user follows the author
        return post.visibility === "followers" || (!!me && post.authorHandle === me.handle)
      }
      if (filter === "communities") {
        return post.tags.some(tag => tag.includes("community") || tag.includes("challenge"))
      }
      
      return true
    })
  }, [posts, searchQuery, filter, me])

  const sortedPosts = useMemo(() => {
    return [...filteredPosts].sort((a, b) => {
      if (sort === "new") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
      // Top (by reactions)
      return b.reactions - a.reactions
    })
  }, [filteredPosts, sort])

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
          <Sparkles className="h-4 w-4 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Feed</h1>
          <p className="text-muted-foreground">Share tips, wins, and progress with the community</p>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Main Content */}
        <div className="flex-1 max-w-2xl">
          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tips, #tags, people…"
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters and Sort */}
          <div className="flex flex-wrap gap-2 mb-6">
            <div className="flex gap-1">
              <Button
                variant={filter === "foryou" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("foryou")}
              >
                For You
              </Button>
              <Button
                variant={filter === "following" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("following")}
              >
                Following
              </Button>
              <Button
                variant={filter === "communities" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("communities")}
              >
                Communities
              </Button>
            </div>
            <div className="flex gap-1 ml-auto">
              <Button
                variant={sort === "top" ? "default" : "outline"}
                size="sm"
                onClick={() => setSort("top")}
              >
                Top
              </Button>
              <Button
                variant={sort === "new" ? "default" : "outline"}
                size="sm"
                onClick={() => setSort("new")}
              >
                New
              </Button>
            </div>
          </div>

          {/* Post Composer */}
          <PostComposer
            userAvatar={me?.avatar || "/placeholder-user.jpg"}
            userAlias={me?.alias || "You"}
            onPost={handlePost}
            isLoading={isLoading}
            communities={suggestedCommunities.filter(c => c.isJoined)}
            pods={(podsData as unknown as Pod[]) || []}
          />

          {/* New posts banner */}
          {pendingPosts.length > 0 && (
            <div className="sticky top-16 z-10 mb-4">
              <Button onClick={mergePendingPosts} className="w-full" variant="secondary">
                <Sparkles className="h-4 w-4 mr-2" /> Show {pendingPosts.length} new {pendingPosts.length === 1 ? "post" : "posts"}
              </Button>
            </div>
          )}

          {/* Timeline */}
          <div className="space-y-4 mt-6">
            {sortedPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onReact={handleReact}
                onSave={handleSave}
                onFollow={handleFollow}
                onUnfollow={handleUnfollow}
                onReport={handleReport}
                onHide={handleHide}
                onDelete={handleDelete}
                onOpenComments={() => setCommentsOpen(post.id)}
                isOwner={!!me && post.authorHandle === me.handle}
              />
            ))}
          </div>

          {sortedPosts.length === 0 && (
            <div className="text-center py-12">
              <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">No posts yet</h3>
              <p className="text-muted-foreground mb-4">
                {filter === "following" 
                  ? "You're not following anyone yet — explore Communities"
                  : "Be the first to share a tip or win!"
                }
              </p>
              <Button>Discover Communities</Button>
            </div>
          )}
        </div>

        {/* Right Rail (Desktop) */}
        {!isMobile && (
          <div className="w-80 space-y-6">
            {/* Suggested Communities */}
            {suggestedCommunities.length > 0 && (
              <Card className="rounded-2xl">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Suggested Communities</h3>
                  <div className="space-y-3">
                    {suggestedCommunities.slice(0, 3).map((community) => (
                      <div key={community.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={community.avatar} />
                            <AvatarFallback>{community.name[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{community.name}</p>
                            <p className="text-xs text-muted-foreground">{community.membersCount} members</p>
                          </div>
                        </div>
                        {community.isJoined ? (
                          <Button size="sm" variant="outline" onClick={() => handleLeaveCommunity(community.id)}>Joined</Button>
                        ) : (
                          <Button size="sm" onClick={() => handleJoinCommunity(community.id)}>Join</Button>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>

      {/* Comments Drawer */}
      <CommentsDrawer
        isOpen={!!commentsOpen}
        onClose={() => setCommentsOpen(null)}
        postId={commentsOpen || ""}
      />

      {/* Privacy Note */}
      <div className="mt-8 text-center">
        <p className="text-xs text-muted-foreground">
          Public shows % only. Balances stay private.
        </p>
      </div>
    </div>
  )
}

// Post Composer Component
interface PostComposerProps {
  userAvatar: string
  userAlias: string
  onPost: (content: string, tags: string[], visibility: "public" | "followers" | "community", communityId?: string, podProgress?: { podId: string, fromPercent: number, toPercent: number }) => void
  isLoading: boolean
  communities: Community[]
  pods: Pod[]
}

function PostComposer({ userAvatar, userAlias, onPost, isLoading, communities, pods }: PostComposerProps) {
  const [content, setContent] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [visibility, setVisibility] = useState<"public" | "followers" | "community">("public")
  const [selectedCommunity, setSelectedCommunity] = useState("")
  const [showPodProgress, setShowPodProgress] = useState(false)
  const [selectedPod, setSelectedPod] = useState("")
  const [fromPercent, setFromPercent] = useState(0)
  const [toPercent, setToPercent] = useState(0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    const podProgress = showPodProgress && selectedPod ? {
      podId: selectedPod,
      fromPercent,
      toPercent
    } : undefined

    onPost(content, tags, visibility, selectedCommunity || undefined, podProgress)
    setContent("")
    setTags([])
    setVisibility("public")
    setSelectedCommunity("")
    setShowPodProgress(false)
    setSelectedPod("")
    setFromPercent(0)
    setToPercent(0)
  }

  const addTag = (tag: string) => {
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag])
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  return (
    <Card className="rounded-2xl">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={userAvatar} />
              <AvatarFallback>{userAlias[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                placeholder="Share a savings tip, question, or win…"
                value={content}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
                className="min-h-[100px] resize-none border-0 p-0 focus-visible:ring-0"
              />
            </div>
          </div>

          {/* Pod Progress Toggle */}
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowPodProgress(!showPodProgress)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add % progress from a Pod
            </Button>
          </div>

          {showPodProgress && (
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <div className="flex gap-2">
                <Select value={selectedPod} onValueChange={setSelectedPod}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select pod" />
                  </SelectTrigger>
                  <SelectContent>
                    {pods.map((pod) => (
                      <SelectItem key={pod.id} value={pod.id}>
                        {pod.name} ({Math.round((pod.currentAmount / pod.targetAmount) * 100)}%)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  placeholder="From %"
                  value={fromPercent || ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFromPercent(Number(e.target.value))}
                  className="w-20"
                />
                <span>→</span>
                <Input
                  type="number"
                  placeholder="To %"
                  value={toPercent || ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setToPercent(Number(e.target.value))}
                  className="w-20"
                />
              </div>
              {selectedPod && fromPercent && toPercent && (
                <div className="text-sm text-muted-foreground">
                  {pods.find(p => p.id === selectedPod)?.name} {fromPercent}% → {toPercent}%
                </div>
              )}
            </div>
          )}

          {/* Tags */}
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                  {tag} ×
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addTag("#roundups")}
              >
                #roundups
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addTag("#52week")}
              >
                #52week
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addTag("#cashback")}
              >
                #cashback
              </Button>
            </div>
          </div>

          {/* Audience Selector */}
          <div className="flex items-center justify-between">
            <Select value={visibility} onValueChange={(value: "public" | "followers" | "community") => setVisibility(value)}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="followers">Followers</SelectItem>
                <SelectItem value="community">Post to Community</SelectItem>
              </SelectContent>
            </Select>

            {visibility === "community" && (
              <Select value={selectedCommunity} onValueChange={setSelectedCommunity}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select community" />
                </SelectTrigger>
                <SelectContent>
                  {communities.filter(c => c.isJoined).map((community) => (
                    <SelectItem key={community.id} value={community.id}>
                      {community.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <Button type="submit" disabled={!content.trim() || isLoading}>
              <Send className="h-4 w-4 mr-2" />
              Post
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

// Post Card Component
interface PostCardProps {
  post: UIPost
  onReact: (postId: string) => void
  onSave: (postId: string) => void
  onFollow: (handle: string) => void
  onUnfollow: (handle: string) => void
  onReport: (postId: string) => void
  onHide: (postId: string) => void
  onDelete: (postId: string) => void
  onOpenComments: () => void
  isOwner: boolean
}

function PostCard({ post, onReact, onSave, onFollow, onUnfollow, onReport, onHide, onDelete, onOpenComments, isOwner }: PostCardProps) {
  const [isFollowing, setIsFollowing] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  const handleFollow = () => {
    setIsFollowing(!isFollowing)
    if (isFollowing) {
      onUnfollow(post.authorHandle)
    } else {
      onFollow(post.authorHandle)
    }
  }

  const handleSave = () => {
    setIsSaved(!isSaved)
    onSave(post.id)
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return "now"
    if (diffInHours < 24) return `${diffInHours}h`
    return `${Math.floor(diffInHours / 24)}d`
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {isOwner ? (
                <DropdownMenuItem onClick={() => onDelete(post.id)}>
                  Delete
                </DropdownMenuItem>
              ) : (
                <>
                  <DropdownMenuItem onClick={handleFollow}>
                    {isFollowing ? <UserMinus className="h-4 w-4 mr-2" /> : <UserPlus className="h-4 w-4 mr-2" />}
                    {isFollowing ? "Unfollow" : "Follow"}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onReport(post.id)}>
                    <Flag className="h-4 w-4 mr-2" />
                    Report
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onHide(post.id)}>
                    <EyeOff className="h-4 w-4 mr-2" />
                    Hide
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
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
          <div className="flex items-center gap-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onReact(post.id)}
              className={post.hasReacted ? "text-primary" : ""}
            >
              <ThumbsUp className={`h-4 w-4 mr-2 ${post.hasReacted ? "fill-current" : ""}`} />
              {post.reactions}
            </Button>
            <Button variant="ghost" size="sm" onClick={onOpenComments}>
              <MessageCircle className="h-4 w-4 mr-2" />
              3
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSave} className={isSaved ? "text-primary" : ""}>
              <Bookmark className={`h-4 w-4 mr-2 ${isSaved ? "fill-current" : ""}`} />
              Save
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

// Comments Drawer Component
interface CommentsDrawerProps {
  isOpen: boolean
  onClose: () => void
  postId: string
}

function CommentsDrawer({ isOpen, onClose, postId }: CommentsDrawerProps) {
  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [comments, setComments] = useState<CommentWithAuthor[]>([])

  useEffect(() => {
    let cancelled = false
    if (!isOpen || !postId) return
    ;(async () => {
      const list = await getCommentsFull(postId)
      if (!cancelled) setComments(list)
    })()
    return () => { cancelled = true }
  }, [isOpen, postId])

  useEffect(() => {
    if (!isOpen) return
    const unsubscribe = subscribeRealtime({
      comments: async (payload) => {
        const c = payload.new || payload.old
        if (!c || c.post_id !== postId) return
        // Re-fetch to include author info
        const list = await getCommentsFull(postId)
        setComments(list)
      }
    })
    return () => { unsubscribe() }
  }, [isOpen, postId])

  const handleSubmit = async () => {
    if (!newComment.trim()) return
    setIsSubmitting(true)
    try {
      await addComment(postId, newComment.trim())
      setNewComment("")
      const list = await getCommentsFull(postId)
      setComments(list)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Comments</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="max-h-96 overflow-y-auto space-y-4">
            {comments.map(({ comment, author }) => (
              <div key={comment.id} className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={author.avatar_url || "/placeholder-user.jpg"} />
                  <AvatarFallback>{(author.name || author.handle || "?").slice(0,1)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{author.name || author.handle}</span>
                    <span className="text-xs text-muted-foreground">@{author.handle}</span>
                  </div>
                  <p className="text-sm">{comment.text}</p>
                </div>
              </div>
            ))}
            {comments.length === 0 && (
              <div className="text-sm text-muted-foreground">Be the first to comment.</div>
            )}
          </div>
          <div className="flex gap-3 pt-4 border-t">
            <Avatar className="h-8 w-8">
              <AvatarFallback>Y</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[60px] resize-none"
              />
            </div>
            <Button size="sm" disabled={!newComment.trim() || isSubmitting} onClick={handleSubmit}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
