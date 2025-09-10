import { z } from "zod"

// Core Schemas
export const PodSchema = z.object({
  id: z.string(),
  name: z.string(),
  targetAmount: z.number(),
  currentAmount: z.number(),
  targetDate: z.string(),
  isFeatured: z.boolean().default(false),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const ChallengeSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  subtitle: z.string(),
  icon: z.string(),
  expectedImpact: z.string(),
  isActive: z.boolean().default(false),
  sinkPodId: z.string().optional(),
  sinkPodName: z.string().optional(),
  config: z.record(z.any()).optional(),
})

export const InflowSchema = z.object({
  type: z.enum(["roundups", "autosave", "cashback", "manual"]),
  amountLabel: z.string(),
  lastContribution: z.string().optional(),
})

export const EventSchema = z.object({
  id: z.string(),
  podId: z.string(),
  date: z.string(),
  amountLabel: z.string(),
  sourceDetail: z.string(),
  type: z.enum(["deposit", "withdrawal", "interest", "challenge"]),
})

export const SubscriptionSchema = z.object({
  id: z.string(),
  merchant: z.string(),
  monthlyCost: z.number(),
  nextChargeDate: z.string(),
  status: z.enum(["active", "cancelled", "paused"]),
  flags: z.array(z.enum(["duplicate", "overpriced", "low-usage"])).default([]),
})

export const OfferSchema = z.object({
  id: z.string(),
  type: z.enum(["coupon", "giftcard", "cashback", "plan"]),
  label: z.string(),
  estSavingsLabel: z.string(),
  sourceLabel: z.string(),
  description: z.string().optional(),
  expiresAt: z.string().optional(),
})

export const ProfileSchema = z.object({
  id: z.string(),
  handle: z.string(),
  alias: z.string(),
  avatar: z.string().optional(),
  level: z.number(),
  xp: z.number(),
  badges: z.array(z.string()),
  followersCount: z.number(),
  followingCount: z.number(),
  isFollowing: z.boolean().default(false),
  featuredPodId: z.string().optional(),
  featuredPodProgress: z.number().optional(),
})

export const PostSchema = z.object({
  id: z.string(),
  authorHandle: z.string(),
  authorAlias: z.string(),
  authorAvatar: z.string().optional(),
  content: z.string(),
  tags: z.array(z.string()).default([]),
  visibility: z.enum(["public", "followers"]),
  reactions: z.number().default(0),
  hasReacted: z.boolean().default(false),
  createdAt: z.string(),
})

export const CommunitySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  membersCount: z.number(),
  isJoined: z.boolean().default(false),
  avatar: z.string().optional(),
})

export const LeaderboardEntrySchema = z.object({
  rank: z.number(),
  handle: z.string(),
  alias: z.string(),
  avatar: z.string().optional(),
  progress: z.number(),
  streak: z.number().optional(),
})

export const AgentProposalSchema = z.object({
  id: z.string(),
  type: z.enum(["safe-to-save", "subscription-review", "deal"]),
  title: z.string(),
  description: z.string(),
  impactLabel: z.string(),
  amount: z.number().optional(),
  rationale: z.string().optional(),
  actions: z.array(
    z.object({
      label: z.string(),
      variant: z.enum(["primary", "secondary"]),
      action: z.string(),
    }),
  ),
  createdAt: z.string(),
})

// TypeScript types
export type Pod = z.infer<typeof PodSchema>
export type Challenge = z.infer<typeof ChallengeSchema>
export type Inflow = z.infer<typeof InflowSchema>
export type Event = z.infer<typeof EventSchema>
export type Subscription = z.infer<typeof SubscriptionSchema>
export type Offer = z.infer<typeof OfferSchema>
export type Profile = z.infer<typeof ProfileSchema>
export type Post = z.infer<typeof PostSchema>
export type Community = z.infer<typeof CommunitySchema>
export type LeaderboardEntry = z.infer<typeof LeaderboardEntrySchema>
export type AgentProposal = z.infer<typeof AgentProposalSchema>
