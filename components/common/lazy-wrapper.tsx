"use client"

import { Suspense, lazy, ComponentType } from "react"
import { Skeleton } from "@/components/ui/skeleton"

interface LazyWrapperProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function LazyWrapper({ children, fallback }: LazyWrapperProps) {
  return (
    <Suspense fallback={fallback || <DefaultSkeleton />}>
      {children}
    </Suspense>
  )
}

function DefaultSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-32 w-full" />
    </div>
  )
}

// Lazy load heavy components
export const LazyAgentPage = lazy(() => import("@/app/agent/page"))
export const LazyFeedPage = lazy(() => import("@/app/feed/page"))
export const LazyCommunitiesPage = lazy(() => import("@/app/communities/page"))
