"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users } from "lucide-react"
import type { Community } from "@/types"
import Link from "next/link"

interface CommunityCardProps {
  community: Community
  onJoin?: (communityId: string) => void
  onLeave?: (communityId: string) => void
  showDescription?: boolean
}

export function CommunityCard({ community, onJoin, onLeave, showDescription = true }: CommunityCardProps) {
  const handleJoinLeave = () => {
    if (community.isJoined && onLeave) {
      onLeave(community.id)
    } else if (!community.isJoined && onJoin) {
      onJoin(community.id)
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={community.avatar || "/placeholder.svg"} alt={community.name} />
            <AvatarFallback>
              <Users className="h-6 w-6" />
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <CardTitle className="text-lg">
              <Link href={`/communities/${community.id}`} className="hover:underline">
                {community.name}
              </Link>
            </CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline">{community.membersCount} members</Badge>
              {community.isJoined && (
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  Joined
                </Badge>
              )}
            </div>
          </div>

          <Button variant={community.isJoined ? "outline" : "default"} size="sm" onClick={handleJoinLeave}>
            {community.isJoined ? "Leave" : "Join"}
          </Button>
        </div>
      </CardHeader>

      {showDescription && (
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed">{community.description}</p>
        </CardContent>
      )}
    </Card>
  )
}
