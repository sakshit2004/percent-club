"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { 
  ArrowLeft, 
  Users, 
  Share2, 
  TrendingUp
} from "lucide-react"
import type { Community, Post, LeaderboardEntry, Pod } from "@/types"

// Empty community data - will be populated from API
const mockCommunity: Community = {
  id: "",
  name: "",
  description: "",
  membersCount: 0,
  isJoined: false,
  avatar: "/placeholder.svg",
}

const mockCommunityPosts: Post[] = []

const mockLeaderboard: LeaderboardEntry[] = []

export default function CommunityDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("posts")
  const [leaderboardType, setLeaderboardType] = useState("progress")
  const [community, setCommunity] = useState(mockCommunity)
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

  const handleJoinLeave = () => {
    setCommunity(prev => ({ ...prev, isJoined: !prev.isJoined }))
    toast({
      title: community.isJoined ? `Left ${community.name}` : "Joined — say hi!",
      description: community.isJoined ? "You can rejoin anytime." : "Welcome to the community!",
    })
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast({
      title: "Copied share link",
      description: "Community link copied to clipboard.",
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
          <Users className="h-4 w-4 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">{community.name}</h1>
          <p className="text-muted-foreground">{community.description}</p>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Main Content */}
        <div className="flex-1 max-w-4xl">
          {/* Hero Card */}
          <Card className="rounded-2xl mb-8">
            <CardContent className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={community.avatar} />
                    <AvatarFallback className="text-2xl">{community.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-2xl font-bold">{community.name}</h2>
                    <p className="text-muted-foreground">{community.description}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleShare}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  <Button 
                    variant={community.isJoined ? "outline" : "default"}
                    onClick={handleJoinLeave}
                  >
                    {community.isJoined ? "Leave" : "Join"}
                  </Button>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold">{community.membersCount.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Members</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-muted-foreground">Posts this week</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-muted-foreground">Your streak</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList>
              <TabsTrigger value="posts">Posts</TabsTrigger>
              <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
            </TabsList>

            <TabsContent value="posts" className="space-y-6">
              <div className="space-y-4">
                {mockCommunityPosts.map((post) => (
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
                            <Badge variant="outline" className="text-xs">L1</Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>@{post.authorHandle}</span>
                            <span>•</span>
                            <span>now</span>
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
                          0
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Bookmark className="h-4 w-4 mr-2" />
                          Save
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="leaderboard" className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Leaderboard</h3>
                <div className="flex gap-2">
                  <Button
                    variant={leaderboardType === "progress" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setLeaderboardType("progress")}
                  >
                    % Progress
                  </Button>
                  <Button
                    variant={leaderboardType === "streaks" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setLeaderboardType("streaks")}
                  >
                    Streaks
                  </Button>
                </div>
              </div>

              <Card className="rounded-2xl">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b">
                        <tr>
                          <th className="text-left p-4 font-medium">Rank</th>
                          <th className="text-left p-4 font-medium">Member</th>
                          <th className="text-right p-4 font-medium">
                            {leaderboardType === "progress" ? "Progress" : "Streak"}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockLeaderboard.map((entry, index) => (
                          <tr key={entry.handle} className="border-b last:border-b-0">
                            <td className="p-4">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                                {index + 1}
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback className="text-xs">{entry.alias[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium text-sm">{entry.alias}</p>
                                  <p className="text-xs text-muted-foreground">@{entry.handle}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 text-right">
                              <div>
                                <p className="font-medium text-sm">
                                  {leaderboardType === "progress" ? `${entry.progress}%` : `${entry.streak || 0} days`}
                                </p>
                                <p className="text-xs text-muted-foreground">normalized by %</p>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="about" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="rounded-2xl">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">What we're about</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      This is a supportive community for anyone saving for their goals. 
                      Whether you're saving for your own education, your children's future, or helping 
                      family members, we're here to share tips, celebrate milestones, and keep each other motivated.
                    </p>
                    <div className="space-y-2">
                      <h4 className="font-medium">Posting guidelines</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Share progress updates and milestones</li>
                        <li>• Ask questions and seek advice</li>
                        <li>• Be supportive and encouraging</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">Popular tags</h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="secondary">#community</Badge>
                      <Badge variant="secondary">#savings</Badge>
                      <Badge variant="secondary">#goals</Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium">Moderators</h4>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">M</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">@moderator</span>
                      </div>
                    </div>

                    <Button variant="outline" size="sm" className="mt-4">
                      Report issue
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Rail (Desktop) */}
        {!isMobile && (
          <div className="w-80 space-y-6">
            {/* Top this week */}
            <Card className="rounded-2xl">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Top this week</h3>
                <div className="space-y-3">
                  {mockLeaderboard.slice(0, 5).map((entry) => (
                    <div key={entry.rank} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                          {entry.rank}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{entry.alias}</p>
                          <p className="text-xs text-muted-foreground">@{entry.handle}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-sm">{entry.progress}%</p>
                        <p className="text-xs text-muted-foreground">normalized by %</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Privacy Note */}
      <div className="mt-8 text-center">
        <p className="text-xs text-muted-foreground">
          Public shows % only. Balances stay private.
        </p>
      </div>
    </div>
  )
}