"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { 
  Edit3, 
  Share2, 
  UserPlus, 
  UserMinus, 
  MoreHorizontal,
  Bookmark,
  ThumbsUp,
  MessageCircle,
  Users,
  Target,
  TrendingUp,
  Calendar,
  Plus,
  Settings,
  Flag,
  Eye,
  EyeOff
} from "lucide-react"
import type { Profile, Post, Community, Pod, LeaderboardEntry } from "@/types"

// Mock data
const mockOwnProfile: Profile = {
  id: "1",
  handle: "saver_ava",
  alias: "Saver Ava",
  avatar: "/diverse-user-avatars.png",
  level: 3,
  xp: 1250,
  badges: ["first-pod", "streak-7", "saver-500", "challenger"],
  followersCount: 128,
  followingCount: 76,
  isFollowing: false,
  featuredPodId: "1",
  featuredPodProgress: 45,
}

const mockOtherProfile: Profile = {
  id: "2",
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
    authorHandle: "saver_ava",
    authorAlias: "Saver Ava",
    authorAvatar: "/diverse-user-avatars.png",
    content: "Just hit 45% on my education fund! The round-up challenge has been a game changer. Small amounts really do add up over time. 💪",
    tags: ["#milestone", "#education", "#roundups"],
    visibility: "public",
    reactions: 12,
    hasReacted: false,
    createdAt: "2024-01-15T14:30:00Z",
  },
  {
    id: "2",
    authorHandle: "saver_ava",
    authorAlias: "Saver Ava",
    authorAvatar: "/diverse-user-avatars.png",
    content: "Pro tip: Set up your challenges to feed different pods based on priority. My round-ups go to education fund, weekly auto-save goes to travel fund!",
    tags: ["#tips", "#strategy", "#challenges"],
    visibility: "public",
    reactions: 8,
    hasReacted: false,
    createdAt: "2024-01-14T09:15:00Z",
  },
  {
    id: "3",
    authorHandle: "saver_ava",
    authorAlias: "Saver Ava",
    authorAvatar: "/diverse-user-avatars.png",
    content: "Week 3 of the 52-week challenge complete! Already saved $78 and it's getting easier each week. Who else is doing this challenge?",
    tags: ["#52week", "#challenge", "#progress"],
    visibility: "public",
    reactions: 15,
    hasReacted: true,
    createdAt: "2024-01-13T16:20:00Z",
  },
]

const mockCommunities: Community[] = [
  {
    id: "1",
    name: "Education Savers",
    description: "From textbooks to tuition — % at a time",
    membersCount: 1234,
    isJoined: true,
    avatar: "/emergency-fund-icon.png",
  },
  {
    id: "2",
    name: "Round-Up Ninjas",
    description: "Pennies to progress",
    membersCount: 892,
    isJoined: true,
    avatar: "/vacation-icon.png",
  },
  {
    id: "3",
    name: "52-Week Challengers",
    description: "Steady, increasing weekly saves",
    membersCount: 567,
    isJoined: true,
    avatar: "/challenge-icon.jpg",
  },
]

const mockPods: Pod[] = [
  {
    id: "1",
    name: "Education",
    targetAmount: 15000,
    currentAmount: 6750,
    targetDate: "2025-06-01",
    isFeatured: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "2",
    name: "Travel",
    targetAmount: 5000,
    currentAmount: 750,
    targetDate: "2024-12-15",
    isFeatured: false,
    createdAt: "2024-02-01T00:00:00Z",
    updatedAt: "2024-02-15T00:00:00Z",
  },
]

const mockRecentActivity = [
  {
    id: "1",
    type: "safe-to-save",
    description: "+$24 weekly safe-save → Education",
    date: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    type: "roundup",
    description: "+$3.50 round-up → Education",
    date: "2024-01-14T15:30:00Z",
  },
  {
    id: "3",
    type: "challenge",
    description: "52-week challenge: Week 3 complete",
    date: "2024-01-13T09:00:00Z",
  },
]

export default function ProfilePage() {
  const params = useParams()
  const router = useRouter()
  const handle = params.handle as string
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showFeaturedPodDialog, setShowFeaturedPodDialog] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [postFilter, setPostFilter] = useState("all")
  const [isFollowing, setIsFollowing] = useState(false)

  // In a real app, you'd fetch the profile based on the handle
  const isOwnProfile = handle === "me"
  const profile = isOwnProfile ? mockOwnProfile : mockOtherProfile

  // Check for mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleFollow = () => {
    setIsFollowing(!isFollowing)
    toast({
      title: isFollowing ? `Unfollowed @${profile.handle}` : `You're now following @${profile.handle}`,
      description: isFollowing ? "You won't see their posts in your Following feed anymore." : "You'll see their posts in your Following feed.",
    })
  }

  const handleShareProfile = () => {
    navigator.clipboard.writeText(`${window.location.origin}/profile/${profile.handle}`)
    toast({
      title: "Profile shared",
      description: "Profile link copied to clipboard.",
    })
  }

  const handleEditProfile = () => {
    setShowEditDialog(true)
  }

  const handleEditFeaturedPod = () => {
    setShowFeaturedPodDialog(true)
  }

  const handlePost = (content: string, tags: string[], visibility: "public" | "followers") => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Posted — nice one!",
        description: "Your post has been shared with the community!",
      })
      setIsLoading(false)
    }, 1000)
  }

  const handleReact = (postId: string) => {
    toast({
      title: "Reaction added",
      description: "You liked this post!",
    })
  }

  const handleSave = (postId: string) => {
    toast({
      title: "Saved to your list",
      description: "Post has been bookmarked.",
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

  const filteredPosts = mockPosts.filter((post) => {
    if (postFilter === "tips") return post.tags.some(tag => tag.includes("tip"))
    if (postFilter === "wins") return post.tags.some(tag => tag.includes("milestone") || tag.includes("progress"))
    return true
  })

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Profile Header */}
      <Card className="rounded-2xl mb-8">
        <CardContent className="p-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile.avatar} />
                <AvatarFallback className="text-2xl">{profile.alias[0]}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold">{profile.alias}</h1>
                  <Badge variant="outline" className="text-sm">L{profile.level}</Badge>
                  {isOwnProfile && (
                    <Button variant="ghost" size="sm" onClick={handleEditProfile}>
                      <Edit3 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <p className="text-muted-foreground mb-4">@{profile.handle}</p>
                
                {/* Stats */}
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{profile.badges.length}</p>
                    <p className="text-sm text-muted-foreground">Badges</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">L{profile.level}</p>
                    <p className="text-sm text-muted-foreground">Level</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{profile.followersCount}</p>
                    <p className="text-sm text-muted-foreground">Followers</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{profile.followingCount}</p>
                    <p className="text-sm text-muted-foreground">Following</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              {!isOwnProfile && (
                <Button 
                  variant={isFollowing ? "outline" : "default"}
                  onClick={handleFollow}
                >
                  {isFollowing ? <UserMinus className="h-4 w-4 mr-2" /> : <UserPlus className="h-4 w-4 mr-2" />}
                  {isFollowing ? "Following" : "Follow"}
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={handleShareProfile}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              {!isOwnProfile && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Flag className="h-4 w-4 mr-2" />
                      Report
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>

          {/* Featured Pod */}
          {profile.featuredPodProgress && (
            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
              <Target className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Featured Pod: Education {profile.featuredPodProgress}%</p>
                <p className="text-sm text-muted-foreground">Public sees % only</p>
              </div>
              {isOwnProfile && (
                <Button variant="ghost" size="sm" onClick={handleEditFeaturedPod}>
                  <Edit3 className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}

          {!isOwnProfile && (
            <div className="mt-4 p-3 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground">percent-only view</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
          <TabsTrigger value="communities">Communities</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* About Me */}
            <Card className="rounded-2xl">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">About me</h3>
                {isOwnProfile ? (
                  <div className="space-y-4">
                    <Textarea 
                      placeholder="Tell the community about yourself..."
                      className="min-h-[100px] resize-none"
                    />
                    <Button size="sm">Save bio</Button>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No bio yet</p>
                )}
              </CardContent>
            </Card>

            {/* Featured Pod Progress */}
            <Card className="rounded-2xl">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Featured Pod Progress</h3>
                {profile.featuredPodProgress ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">{profile.featuredPodProgress}%</span>
                      <span className="text-sm text-muted-foreground">Education</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all" 
                        style={{ width: `${profile.featuredPodProgress}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">Public shows % only. Balances stay private.</p>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground mb-4">No featured pod yet</p>
                    {isOwnProfile && (
                      <Button size="sm" onClick={handleEditFeaturedPod}>
                        <Plus className="h-4 w-4 mr-2" />
                        Pick a pod to feature
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="rounded-2xl md:col-span-2">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {mockRecentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <div className="h-2 w-2 bg-primary rounded-full" />
                      <div className="flex-1">
                        <p className="text-sm">{activity.description}</p>
                        <p className="text-xs text-muted-foreground">{formatTimeAgo(activity.date)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Badges Grid */}
            <Card className="rounded-2xl md:col-span-2">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Badges</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {profile.badges.map((badge) => (
                    <div key={badge} className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="h-12 w-12 bg-primary/10 rounded-full mx-auto mb-2 flex items-center justify-center">
                        <Target className="h-6 w-6 text-primary" />
                      </div>
                      <p className="text-sm font-medium capitalize">{badge.replace('-', ' ')}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="posts" className="space-y-6">
          {/* Post Filters */}
          <div className="flex gap-2">
            <Button
              variant={postFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setPostFilter("all")}
            >
              All
            </Button>
            <Button
              variant={postFilter === "tips" ? "default" : "outline"}
              size="sm"
              onClick={() => setPostFilter("tips")}
            >
              Tips
            </Button>
            <Button
              variant={postFilter === "wins" ? "default" : "outline"}
              size="sm"
              onClick={() => setPostFilter("wins")}
            >
              Wins
            </Button>
          </div>

          {/* Posts */}
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
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
                  <p className="text-sm leading-relaxed mb-4">{post.content}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-6 pt-4 border-t">
                    <Button variant="ghost" size="sm">
                      <ThumbsUp className="h-4 w-4 mr-2" />
                      {post.reactions}
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      3
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleSave(post.id)}>
                      <Bookmark className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <Card className="rounded-2xl">
              <CardContent className="p-8 text-center">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">No posts yet</h3>
                <p className="text-muted-foreground mb-4">
                  {isOwnProfile ? "Share your first tip or win!" : "This user hasn't shared any posts yet."}
                </p>
                {isOwnProfile && (
                  <Button>Create Post</Button>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="badges">
          <Card className="rounded-2xl">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-6">Badges</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {profile.badges.map((badge) => (
                  <div key={badge} className="text-center p-6 bg-muted/50 rounded-lg">
                    <div className="h-16 w-16 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Target className="h-8 w-8 text-primary" />
                    </div>
                    <p className="font-medium capitalize">{badge.replace('-', ' ')}</p>
                    <p className="text-sm text-muted-foreground mt-1">Earned badge</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="communities">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mockCommunities.map((community) => (
              <Card key={community.id} className="rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={community.avatar} />
                      <AvatarFallback>{community.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{community.name}</h3>
                      <p className="text-sm text-muted-foreground">{community.membersCount} members</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{community.description}</p>
                  <Button variant="outline" size="sm" className="w-full">
                    View Community
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Profile Dialog */}
      <EditProfileDialog
        isOpen={showEditDialog}
        onClose={() => setShowEditDialog(false)}
        profile={profile}
      />

      {/* Edit Featured Pod Dialog */}
      <EditFeaturedPodDialog
        isOpen={showFeaturedPodDialog}
        onClose={() => setShowFeaturedPodDialog(false)}
        pods={mockPods}
        currentFeaturedPodId={profile.featuredPodId}
      />

      {/* Privacy Note */}
      <div className="mt-8 text-center">
        <p className="text-xs text-muted-foreground">
          Public shows alias & % only. Balances stay private.
        </p>
      </div>
    </div>
  )
}

// Edit Profile Dialog Component
interface EditProfileDialogProps {
  isOpen: boolean
  onClose: () => void
  profile: Profile
}

function EditProfileDialog({ isOpen, onClose, profile }: EditProfileDialogProps) {
  const [alias, setAlias] = useState(profile.alias)
  const [bio, setBio] = useState("")
  const { toast } = useToast()

  const handleSave = () => {
    toast({
      title: "Alias updated",
      description: "Your profile has been updated.",
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Display Name</label>
            <Input
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
              placeholder="Your display name"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Bio</label>
            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell the community about yourself..."
              className="min-h-[100px] resize-none"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Edit Featured Pod Dialog Component
interface EditFeaturedPodDialogProps {
  isOpen: boolean
  onClose: () => void
  pods: Pod[]
  currentFeaturedPodId?: string
}

function EditFeaturedPodDialog({ isOpen, onClose, pods, currentFeaturedPodId }: EditFeaturedPodDialogProps) {
  const [selectedPodId, setSelectedPodId] = useState(currentFeaturedPodId || "")
  const { toast } = useToast()

  const handleSave = () => {
    const selectedPod = pods.find(p => p.id === selectedPodId)
    toast({
      title: "Featured % saved",
      description: `${selectedPod?.name} is now your featured pod.`,
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Featured Pod</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Choose a pod to feature</label>
            <div className="space-y-2 mt-2">
              {pods.map((pod) => (
                <div
                  key={pod.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedPodId === pod.id ? "border-primary bg-primary/5" : "border-border"
                  }`}
                  onClick={() => setSelectedPodId(pod.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{pod.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {Math.round((pod.currentAmount / pod.targetAmount) * 100)}% complete
                      </p>
                    </div>
                    {selectedPodId === pod.id && (
                      <div className="h-4 w-4 rounded-full bg-primary" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground">
              Public shows % only. Balances stay private.
            </p>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!selectedPodId}>
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
