"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, MessageCircle, Share } from "lucide-react"
import { formatRelativeTime } from "@/lib/format"
import type { Post } from "@/types"
import Link from "next/link"

interface PostItemProps {
  post: Post
  onReact?: (postId: string) => void
  onShare?: (postId: string) => void
}

export function PostItem({ post, onReact, onShare }: PostItemProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex gap-3">
          <Link href={`/profile/${post.authorHandle}`}>
            <Avatar className="h-10 w-10 cursor-pointer">
              <AvatarImage src={post.authorAvatar || "/placeholder.svg"} alt={post.authorAlias} />
              <AvatarFallback>{post.authorAlias.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          </Link>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Link href={`/profile/${post.authorHandle}`} className="hover:underline">
                <span className="font-semibold">{post.authorAlias}</span>
              </Link>
              <span className="text-muted-foreground">@{post.authorHandle}</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">{formatRelativeTime(post.createdAt)}</span>
              {post.visibility === "followers" && (
                <Badge variant="outline" className="text-xs">
                  Followers only
                </Badge>
              )}
            </div>

            <p className="text-sm leading-relaxed mb-3">{post.content}</p>

            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}

            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onReact?.(post.id)}
                className={`gap-2 ${post.hasReacted ? "text-destructive" : "text-muted-foreground"}`}
              >
                <Heart className={`h-4 w-4 ${post.hasReacted ? "fill-current" : ""}`} />
                <span className="text-xs">{post.reactions}</span>
              </Button>

              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
                <MessageCircle className="h-4 w-4" />
                <span className="text-xs">Reply</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => onShare?.(post.id)}
                className="gap-2 text-muted-foreground"
              >
                <Share className="h-4 w-4" />
                <span className="text-xs">Share</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
