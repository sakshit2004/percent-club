"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { UserPlus, UserMinus, Settings } from "lucide-react"
import type { Profile } from "@/types"

interface ProfileHeaderProps {
  profile: Profile
  isOwnProfile?: boolean
  onFollow?: (profileId: string) => void
  onUnfollow?: (profileId: string) => void
}

export function ProfileHeader({ profile, isOwnProfile = false, onFollow, onUnfollow }: ProfileHeaderProps) {
  const handleFollowClick = () => {
    if (profile.isFollowing && onUnfollow) {
      onUnfollow(profile.id)
    } else if (!profile.isFollowing && onFollow) {
      onFollow(profile.id)
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start gap-6">
          <Avatar className="h-20 w-20">
            <AvatarImage src={profile.avatar || "/placeholder.svg"} alt={profile.alias} />
            <AvatarFallback className="text-lg font-semibold">{profile.alias.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold">{profile.alias}</h1>
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                Level {profile.level}
              </Badge>
            </div>

            <p className="text-muted-foreground mb-4">@{profile.handle}</p>

            <div className="flex items-center gap-6 text-sm">
              <div>
                <span className="font-semibold">{profile.followersCount}</span>
                <span className="text-muted-foreground ml-1">followers</span>
              </div>
              <div>
                <span className="font-semibold">{profile.followingCount}</span>
                <span className="text-muted-foreground ml-1">following</span>
              </div>
              <div>
                <span className="font-semibold">{profile.xp}</span>
                <span className="text-muted-foreground ml-1">XP</span>
              </div>
            </div>

            {profile.featuredPodId && profile.featuredPodProgress !== undefined && (
              <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                <div className="text-sm font-medium mb-1">Featured Goal Progress</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-background rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${profile.featuredPodProgress}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{profile.featuredPodProgress}%</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            {isOwnProfile ? (
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <Button onClick={handleFollowClick} variant={profile.isFollowing ? "outline" : "default"}>
                {profile.isFollowing ? (
                  <>
                    <UserMinus className="h-4 w-4 mr-2" />
                    Unfollow
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Follow
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
