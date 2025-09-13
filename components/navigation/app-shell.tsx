"use client"

import { usePathname } from "next/navigation"
import { SiteFooter } from "@/components/navigation/site-footer"

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const hideOn = [
    "/pods",
    "/challenges",
    "/agent",
    "/feed",
    "/communities",
  ]
  const shouldHideFooter = hideOn.some(p => pathname === p || pathname.startsWith(p + "/"))

  return (
    <>
      {children}
      {!shouldHideFooter && <SiteFooter />}
    </>
  )
}


