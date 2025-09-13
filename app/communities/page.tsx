"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { Search, Users, TrendingUp, Filter, Plus } from "lucide-react"
import type { Community, LeaderboardEntry } from "@/types"
import { 
  listCommunities, 
  getMyJoinedCommunityIds, 
  getCommunityMemberCounts, 
  joinCommunity, 
  leaveCommunity, 
  subscribeRealtime 
} from "@/lib/social"

const mockTopMembers: LeaderboardEntry[] = [
  { rank: 1, handle: "savingsstar", alias: "Sarah Chen", progress: 68, streak: 12 },
  { rank: 2, handle: "budgetboss", alias: "Mike Rodriguez", progress: 45, streak: 8 },
  { rank: 3, handle: "goaldigger", alias: "Emma Thompson", progress: 42, streak: 15 },
]

export default function CommunitiesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState("all")
  const [category, setCategory] = useState("all")
  const [communities, setCommunities] = useState<Community[]>([])
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

  // Initial load
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const base = await listCommunities(200)
      const joined = await getMyJoinedCommunityIds()
      const counts = await getCommunityMemberCounts(base.map((c: any) => c.id))
      if (cancelled) return
      const mapped: Community[] = base.map((c: any) => ({
        id: c.id,
        name: c.title,
        description: c.description || "",
        membersCount: counts[c.id] ?? 0,
        isJoined: joined.has(c.id),
        avatar: c.cover_url || "/placeholder.svg",
      }))
      setCommunities(mapped)
    })()
    return () => { cancelled = true }
  }, [])

  // Realtime updates
  useEffect(() => {
    const unsubscribe = subscribeRealtime({
      communities: (payload) => {
        if (payload.eventType === "INSERT") {
          const c = payload.new
          setCommunities(prev => [{
            id: c.id,
            name: c.title,
            description: c.description || "",
            membersCount: 0,
            isJoined: false,
            avatar: c.cover_url || "/placeholder.svg",
          }, ...prev])
        } else if (payload.eventType === "UPDATE") {
          const c = payload.new
          setCommunities(prev => prev.map(p => p.id === c.id ? {
            ...p,
            name: c.title,
            description: c.description || "",
            avatar: c.cover_url || p.avatar,
          } : p))
        } else if (payload.eventType === "DELETE") {
          const c = payload.old
          setCommunities(prev => prev.filter(p => p.id !== c.id))
        }
      },
      community_members: (payload) => {
        if (payload.eventType === "INSERT") {
          const cm = payload.new
          setCommunities(prev => prev.map(c => c.id === cm.community_id ? { ...c, membersCount: c.membersCount + 1 } : c))
        } else if (payload.eventType === "DELETE") {
          const cm = payload.old
          setCommunities(prev => prev.map(c => c.id === cm.community_id ? { ...c, membersCount: Math.max(0, c.membersCount - 1) } : c))
        }
      }
    })
    return () => { unsubscribe() }
  }, [])

  const handleJoin = async (communityId: string) => {
    setCommunities(prev => prev.map(community => 
      community.id === communityId 
        ? { ...community, isJoined: true }
        : community
    ))
    try {
      await joinCommunity(communityId)
      const community = communities.find((c) => c.id === communityId)
      toast({
        title: `Joined ${community?.name} — welcome!`,
        description: "You'll now see posts from this community in your feed.",
      })
    } catch (e: any) {
      setCommunities(prev => prev.map(community => 
        community.id === communityId 
          ? { ...community, isJoined: false }
          : community
      ))
      toast({ title: "Couldn't join", description: e?.message || "Please try again." })
    }
  }

  const handleLeave = async (communityId: string) => {
    setCommunities(prev => prev.map(community => 
      community.id === communityId 
        ? { ...community, isJoined: false }
        : community
    ))
    try {
      await leaveCommunity(communityId)
      const community = communities.find((c) => c.id === communityId)
      toast({
        title: `Left ${community?.name}`,
        description: "You can rejoin anytime.",
      })
    } catch (e: any) {
      setCommunities(prev => prev.map(community => 
        community.id === communityId 
          ? { ...community, isJoined: true }
          : community
      ))
      toast({ title: "Couldn't leave", description: e?.message || "Please try again." })
    }
  }

  const filteredCommunities = communities.filter((community) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      if (!community.name.toLowerCase().includes(query) && 
          !community.description.toLowerCase().includes(query)) {
        return false
      }
    }
    if (filter === "joined") return community.isJoined
    if (filter === "trending") return community.membersCount > 1000
    return true
  })

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

      <div className="flex gap-8">
        {/* Main Content */}
        <div className="flex-1">
          {/* Search and Filters */}
          <div className="space-y-4 mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Find communities"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <div className="flex gap-1">
                <Button
                  variant={filter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("all")}
                >
                  All
                </Button>
                <Button
                  variant={filter === "joined" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("joined")}
                >
                  Joined
                </Button>
                <Button
                  variant={filter === "trending" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("trending")}
                >
                  <TrendingUp className="h-4 w-4 mr-1" />
                  Trending
                </Button>
              </div>
              
              <div className="flex gap-1 ml-auto">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-1" />
                  Education
                </Button>
                <Button variant="outline" size="sm">
                  Housing
                </Button>
                <Button variant="outline" size="sm">
                  52-Week
                </Button>
              </div>
            </div>
          </div>

          {/* Communities Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCommunities.map((community) => (
              <CommunityCard
                key={community.id}
                community={community}
                onJoin={handleJoin}
                onLeave={handleLeave}
                topMembers={mockTopMembers}
              />
            ))}
          </div>

          {filteredCommunities.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">No communities found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your search terms or filters.</p>
              <Button>Create Community</Button>
            </div>
          )}
        </div>

        {/* Right Rail (Desktop) */}
        {!isMobile && (
          <div className="w-80 space-y-6">
            {/* Quick Stats */}
            <Card className="rounded-2xl">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Your Communities</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Joined</span>
                    <span className="font-medium">{joinedCommunities.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Members</span>
                    <span className="font-medium">
                      {joinedCommunities.reduce((sum, c) => sum + c.membersCount, 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">This Week</span>
                    <span className="font-medium">+12 posts</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Communities */}
            <Card className="rounded-2xl">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Top Communities</h3>
                <div className="space-y-3">
                  {communities
                    .sort((a, b) => b.membersCount - a.membersCount)
                    .slice(0, 5)
                    .map((community) => (
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
                        <Button size="sm" variant={community.isJoined ? "outline" : "default"}>
                          {community.isJoined ? "Joined" : "Join"}
                        </Button>
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

// Community Card Component
interface CommunityCardProps {
  community: Community
  onJoin: (communityId: string) => void
  onLeave: (communityId: string) => void
  topMembers: LeaderboardEntry[]
}

function CommunityCard({ community, onJoin, onLeave, topMembers }: CommunityCardProps) {
  const handleJoinLeave = () => {
    if (community.isJoined) {
      onLeave(community.id)
    } else {
      onJoin(community.id)
    }
  }

  return (
    <Card className="rounded-2xl hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={community.avatar} />
              <AvatarFallback>{community.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg">{community.name}</h3>
              <p className="text-sm text-muted-foreground">{community.description}</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="font-semibold">{community.membersCount.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">members</p>
            </div>
            <div className="text-center">
              <p className="font-semibold">Active</p>
              <p className="text-xs text-muted-foreground">this week</p>
            </div>
          </div>
          <Badge variant="outline" className="text-xs">
            {community.membersCount > 1000 ? "Trending" : "Growing"}
          </Badge>
        </div>

        {/* Top Members Preview */}
        <div className="mb-4">
          <p className="text-xs font-medium text-muted-foreground mb-2">Top this week</p>
          <div className="flex items-center gap-2">
            {topMembers.slice(0, 3).map((member) => (
              <div key={member.handle} className="flex items-center gap-1">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs">{member.alias[0]}</AvatarFallback>
                </Avatar>
                <span className="text-xs text-muted-foreground">{member.progress}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant={community.isJoined ? "outline" : "default"}
            className="flex-1"
            onClick={handleJoinLeave}
          >
            {community.isJoined ? "Leave" : "Join"}
          </Button>
          <Button variant="outline" size="sm">
            View
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
