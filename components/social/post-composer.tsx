"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Globe, Users, X } from "lucide-react"

interface PostComposerProps {
  userAvatar?: string
  userAlias: string
  onPost: (content: string, tags: string[], visibility: "public" | "followers") => void
  isLoading?: boolean
}

const suggestedTags = ["savings", "goals", "challenges", "milestone", "motivation", "tips"]

export function PostComposer({ userAvatar, userAlias, onPost, isLoading = false }: PostComposerProps) {
  const [content, setContent] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [visibility, setVisibility] = useState<"public" | "followers">("public")
  const [newTag, setNewTag] = useState("")

  const handleSubmit = () => {
    if (content.trim()) {
      onPost(content.trim(), tags, visibility)
      setContent("")
      setTags([])
      setVisibility("public")
    }
  }

  const addTag = (tag: string) => {
    if (tag && !tags.includes(tag) && tags.length < 5) {
      setTags([...tags, tag])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={userAvatar || "/placeholder.svg"} alt={userAlias} />
            <AvatarFallback>{userAlias.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-3">
            <Textarea
              placeholder="Share your savings journey, celebrate a milestone, or motivate others..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={3}
              className="resize-none"
            />

            {/* Tags */}
            <div className="space-y-2">
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      #{tag}
                      <button onClick={() => removeTag(tag)} className="hover:bg-muted rounded-full p-0.5">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {suggestedTags
                  .filter((tag) => !tags.includes(tag))
                  .slice(0, 6)
                  .map((tag) => (
                    <Button key={tag} variant="outline" size="sm" onClick={() => addTag(tag)} className="h-7 text-xs">
                      #{tag}
                    </Button>
                  ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <Select value={visibility} onValueChange={(value: "public" | "followers") => setVisibility(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Public
                    </div>
                  </SelectItem>
                  <SelectItem value="followers">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Followers
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>

              <Button onClick={handleSubmit} disabled={!content.trim() || isLoading}>
                {isLoading ? "Posting..." : "Post"}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
