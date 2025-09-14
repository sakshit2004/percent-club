"use client"

import { createClient as createBrowserSupabase } from "@/lib/supabase/client"

export type Visibility = "public" | "followers"
export type CommunityVisibility = "public" | "private" | "invite"
export type FollowStatus = "accepted" | "requested" | "blocked"
export type MemberRole = "owner" | "admin" | "moderator" | "member"
export type MemberStatus = "joined" | "requested" | "invited"

export type Profile = {
  id: string
  handle: string
  name: string
  avatar_url?: string | null
  bio?: string | null
  privacy: "public" | "protected"
  created_at: string
  updated_at: string
}

export type Community = {
  id: string
  title: string
  description?: string | null
  cover_url?: string | null
  visibility: CommunityVisibility
  tags: string[]
  rules?: string | null
  owner_id: string
  created_at: string
}

export type CommunityMember = {
  community_id: string
  user_id: string
  role: MemberRole
  status: MemberStatus
  created_at: string
}

export type Post = {
  id: string
  author_id: string
  community_id?: string | null
  text: string
  image_url?: string | null
  link_url?: string | null
  visibility: Visibility
  is_removed: boolean
  removed_reason?: string | null
  created_at: string
  updated_at: string
}

export type Comment = {
  id: string
  post_id: string
  user_id: string
  text: string
  created_at: string
}

export type Notification = {
  id: string
  user_id: string
  type: string
  payload: any
  read_at?: string | null
  created_at: string
}

export type Challenge = {
  id: string
  community_id?: string | null
  creator_id: string
  title: string
  description?: string | null
  start_at: string
  end_at: string
  rules?: string | null
  proof_type: "text" | "image" | "link"
  status: "draft" | "active" | "completed" | "expired"
  created_at: string
}

export type ChallengeParticipant = {
  challenge_id: string
  user_id: string
  status: "invited" | "accepted" | "declined" | "completed"
  progress: number
  proof?: string | null
  verified_by?: string | null
  verified_at?: string | null
  created_at: string
}

function sb() {
  return createBrowserSupabase()
}

// Profiles
export async function getProfileByHandle(handle: string) {
  const { data, error } = await sb()
    .from("profiles")
    .select("*")
    .eq("handle", handle)
    .single()
  if (error) throw error
  return data as Profile
}

export async function updateProfile(updates: Partial<Pick<Profile, "name" | "avatar_url" | "bio" | "privacy">>) {
  const client = sb()
  const { data: user } = await client.auth.getUser()
  if (!user.user) throw new Error("Not authenticated")
  const { data, error } = await client
    .from("profiles")
    .update(updates)
    .eq("id", user.user.id)
    .select("*")
    .single()
  if (error) throw error
  return data as Profile
}

// Follow
export async function followUser(followeeId: string) {
  const client = sb()
  const { data: user } = await client.auth.getUser()
  if (!user.user) throw new Error("Not authenticated")
  const { data, error } = await client
    .from("follows")
    .upsert({ follower_id: user.user.id, followee_id: followeeId }, { onConflict: "follower_id,followee_id" })
    .select("*")
    .single()
  if (error) throw error
  return data
}

export async function unfollowUser(followeeId: string) {
  const client = sb()
  const { data: user } = await client.auth.getUser()
  if (!user.user) throw new Error("Not authenticated")
  const { error } = await client
    .from("follows")
    .delete()
    .eq("follower_id", user.user.id)
    .eq("followee_id", followeeId)
  if (error) throw error
  return { ok: true }
}

// Communities
export async function createCommunity(input: Pick<Community, "title" | "description" | "visibility" | "tags" | "rules"> & { cover_url?: string | null }) {
  const client = sb()
  const { data: user } = await client.auth.getUser()
  if (!user.user) throw new Error("Not authenticated")
  const { data, error } = await client
    .from("communities")
    .insert({
      title: input.title,
      description: input.description ?? null,
      visibility: input.visibility,
      tags: input.tags ?? [],
      rules: input.rules ?? null,
      cover_url: input.cover_url ?? null,
      owner_id: user.user.id,
    })
    .select("*")
    .single()
  if (error) throw error
  // Owner becomes a member with role owner
  await client.from("community_members").upsert({ community_id: data.id, user_id: user.user.id, role: "owner", status: "joined" })
  return data as Community
}

export async function searchCommunities(query: string) {
  const client = sb()
  const { data, error } = await client
    .from("communities")
    .select("*")
    .ilike("title", `%${query}%`)
    .limit(50)
  if (error) throw error
  return (data || []) as Community[]
}

export async function joinCommunity(communityId: string) {
  const client = sb()
  const { data: user } = await client.auth.getUser()
  if (!user.user) throw new Error("Not authenticated")
  const { data, error } = await client
    .from("community_members")
    .upsert({ community_id: communityId, user_id: user.user.id, status: "joined", role: "member" }, { onConflict: "community_id,user_id" })
    .select("*")
    .single()
  if (error) throw error
  return data as CommunityMember
}

export async function leaveCommunity(communityId: string) {
  const client = sb()
  const { data: user } = await client.auth.getUser()
  if (!user.user) throw new Error("Not authenticated")
  const { error } = await client
    .from("community_members")
    .delete()
    .eq("community_id", communityId)
    .eq("user_id", user.user.id)
  if (error) throw error
  return { ok: true }
}

// Community helpers for UI
export async function listCommunities(limit = 100) {
  const { data, error } = await sb()
    .from("communities")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit)
  if (error) throw error
  return (data || []) as Community[]
}

export async function getMyJoinedCommunityIds() {
  const client = sb()
  const { data: user } = await client.auth.getUser()
  if (!user.user) return new Set<string>()
  const { data, error } = await client
    .from("community_members")
    .select("community_id")
    .eq("user_id", user.user.id)
    .eq("status", "joined")
  if (error) throw error
  return new Set<string>((data || []).map((r: any) => r.community_id as string))
}

export async function getCommunityMemberCounts(communityIds: string[]) {
  if (!communityIds.length) return {} as Record<string, number>
  const { data, error } = await sb()
    .from("community_members")
    .select("community_id")
    .in("community_id", communityIds)
  if (error) throw error
  const counts: Record<string, number> = {}
  for (const row of (data || []) as any[]) {
    const id = row.community_id as string
    counts[id] = (counts[id] || 0) + 1
  }
  for (const id of communityIds) {
    if (counts[id] == null) counts[id] = 0
  }
  return counts
}

// Posts
export async function createPost(input: { text: string; visibility: Visibility; community_id?: string | null; image_url?: string | null; link_url?: string | null }) {
  const client = sb()
  const { data: user } = await client.auth.getUser()
  if (!user.user) throw new Error("Not authenticated")
  const { data, error } = await client
    .from("posts")
    .insert({
      author_id: user.user.id,
      text: input.text,
      visibility: input.visibility,
      community_id: input.community_id ?? null,
      image_url: input.image_url ?? null,
      link_url: input.link_url ?? null,
    })
    .select("*")
    .single()
  if (error) throw error
  return data as Post
}

export async function likePost(postId: string) {
  const client = sb()
  const { data: user } = await client.auth.getUser()
  if (!user.user) throw new Error("Not authenticated")
  const { error } = await client
    .from("post_likes")
    .upsert({ post_id: postId, user_id: user.user.id })
  if (error) throw error
  return { ok: true }
}

export async function unlikePost(postId: string) {
  const client = sb()
  const { data: user } = await client.auth.getUser()
  if (!user.user) throw new Error("Not authenticated")
  const { error } = await client
    .from("post_likes")
    .delete()
    .eq("post_id", postId)
    .eq("user_id", user.user.id)
  if (error) throw error
  return { ok: true }
}

export async function addComment(postId: string, text: string) {
  const client = sb()
  const { data: user } = await client.auth.getUser()
  if (!user.user) throw new Error("Not authenticated")
  const { data, error } = await client
    .from("comments")
    .insert({ post_id: postId, user_id: user.user.id, text })
    .select("*")
    .single()
  if (error) throw error
  return data as Comment
}

export type CommentWithAuthor = {
  comment: Comment
  author: Pick<Profile, "id" | "handle" | "name" | "avatar_url">
}

export async function getCommentsFull(postId: string): Promise<CommentWithAuthor[]> {
  const client = sb()
  const { data: comments, error } = await client
    .from("comments")
    .select("*")
    .eq("post_id", postId)
    .order("created_at", { ascending: true })
  if (error) throw error
  const list = (comments || []) as Comment[]
  if (!list.length) return []
  const userIds = Array.from(new Set(list.map((c) => c.user_id)))
  const { data: authors, error: perr } = await client
    .from("profiles")
    .select("id,handle,name,avatar_url")
    .in("id", userIds)
  if (perr) throw perr
  const authorMap = new Map<string, { id: string; handle: string; name: string; avatar_url: string | null }>(
    (authors || []).map((a: any) => [a.id as string, a as any])
  )
  return list.map((c) => ({ comment: c, author: (authorMap.get(c.user_id) as any) }))
}

export async function getHomeFeed(limit = 30) {
  // Minimal feed: public posts and joined community posts, newest first
  const { data, error } = await sb()
    .from("v_posts_with_counts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit)
  if (error) throw error
  return data as (Post & { likes_count: number; comments_count: number })[]
}

export type FeedItem = {
  post: Post
  author: Pick<Profile, "id" | "handle" | "name" | "avatar_url">
  likesCount: number
  commentsCount: number
  likedByMe: boolean
}

export async function getHomeFeedFull(limit = 30): Promise<FeedItem[]> {
  const client = sb()
  const { data: vposts, error } = await client
    .from("v_posts_with_counts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit)
  if (error) throw error
  const posts = (vposts || []) as (Post & { likes_count: number; comments_count: number })[]
  const authorIds = Array.from(new Set(posts.map((p) => p.author_id)))
  const { data: authors, error: perr } = await client
    .from("profiles")
    .select("id,handle,name,avatar_url")
    .in("id", authorIds.length ? authorIds : ["00000000-0000-0000-0000-000000000000"]) // guard empty
  if (perr) throw perr
  const authorMap = new Map<string, { id: string; handle: string; name: string; avatar_url: string | null }>(
    (authors || []).map((a: any) => [a.id as string, a as any])
  )
  const { data: user } = await client.auth.getUser()
  let myLikes = new Set<string>()
  if (user.user && posts.length) {
    const { data: likes } = await client
      .from("post_likes")
      .select("post_id")
      .eq("user_id", user.user.id)
      .in("post_id", posts.map((p) => p.id))
    myLikes = new Set((likes || []).map((l: any) => l.post_id))
  }
  return posts.map((p) => ({
    post: p,
    author: (authorMap.get(p.author_id) as any) || { id: p.author_id, handle: "", name: "", avatar_url: null },
    likesCount: (p as any).likes_count ?? 0,
    commentsCount: (p as any).comments_count ?? 0,
    likedByMe: myLikes.has(p.id),
  }))
}

// Challenges
export async function createChallenge(input: Omit<Challenge, "id" | "creator_id" | "created_at" | "status"> & { status?: Challenge["status"] }) {
  const client = sb()
  const { data: user } = await client.auth.getUser()
  if (!user.user) throw new Error("Not authenticated")
  const { data, error } = await client
    .from("challenges")
    .insert({
      community_id: input.community_id ?? null,
      creator_id: user.user.id,
      title: input.title,
      description: input.description ?? null,
      start_at: input.start_at,
      end_at: input.end_at,
      rules: input.rules ?? null,
      proof_type: input.proof_type,
      status: input.status ?? "active",
    })
    .select("*")
    .single()
  if (error) throw error
  return data as Challenge
}

export async function respondToChallenge(challengeId: string, status: ChallengeParticipant["status"]) {
  const client = sb()
  const { data: user } = await client.auth.getUser()
  if (!user.user) throw new Error("Not authenticated")
  const { data, error } = await client
    .from("challenge_participants")
    .upsert({ challenge_id: challengeId, user_id: user.user.id, status }, { onConflict: "challenge_id,user_id" })
    .select("*")
    .single()
  if (error) throw error
  return data as ChallengeParticipant
}

export async function updateChallengeProgress(challengeId: string, progress: number) {
  const client = sb()
  const { data: user } = await client.auth.getUser()
  if (!user.user) throw new Error("Not authenticated")
  const { data, error } = await client
    .from("challenge_participants")
    .update({ progress })
    .eq("challenge_id", challengeId)
    .eq("user_id", user.user.id)
    .select("*")
    .single()
  if (error) throw error
  return data as ChallengeParticipant
}

// Notifications
export async function markNotificationRead(id: string) {
  const { data, error } = await sb()
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("id", id)
    .select("*")
    .single()
  if (error) throw error
  return data as Notification
}

// Presence
export async function heartbeatPresence() {
  const client = sb()
  const { data: user } = await client.auth.getUser()
  if (!user.user) return
  await client.from("presence").upsert({ user_id: user.user.id, last_seen: new Date().toISOString() })
}

// Subscriptions
export function subscribeRealtime(
  handlers: Partial<{
    posts: (payload: any) => void
    post_likes: (payload: any) => void
    comments: (payload: any) => void
    follows: (payload: any) => void
    community_members: (payload: any) => void
    communities: (payload: any) => void
    challenges: (payload: any) => void
    challenge_participants: (payload: any) => void
    notifications: (payload: any) => void
    presence: (payload: any) => void
  }>,
) {
  const client = sb()
  // Avoid opening many realtime channels in background when tab hidden
  const isHidden = typeof document !== "undefined" && document.hidden
  if (isHidden) {
    return () => {}
  }
  const channels: any[] = []

  function sub(table: string, cb?: (payload: any) => void) {
    if (!cb) return
    const ch = client
      .channel(`realtime:${table}`)
      .on("postgres_changes", { event: "*", schema: "public", table }, (payload: any) => cb(payload))
      .subscribe()
    channels.push(ch)
  }

  sub("posts", handlers.posts)
  sub("post_likes", handlers.post_likes)
  sub("comments", handlers.comments)
  sub("follows", handlers.follows)
  sub("community_members", handlers.community_members)
  sub("communities", handlers.communities)
  sub("challenges", handlers.challenges)
  sub("challenge_participants", handlers.challenge_participants)
  sub("notifications", handlers.notifications)
  sub("presence", handlers.presence)

  return () => {
    channels.forEach((c) => client.removeChannel(c))
  }
}

// Optimistic helpers
export function optimisticArrayInsert<T extends { id: string }>(arr: T[], item: T) {
  return [item, ...arr]
}

export function optimisticArrayToggle<T extends { id: string }>(arr: T[], id: string, updater: (t: T) => T) {
  return arr.map((t) => (t.id === id ? updater(t) : t))
}

