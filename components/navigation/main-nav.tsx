"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sparkles, Target, Zap, Bot, Users, Settings, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/components/auth/auth-provider"
import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"

const navigation = [
  { name: "Pods", href: "/pods", icon: Target },
  { name: "Challenges", href: "/challenges", icon: Zap },
  { name: "Agent", href: "/agent", icon: Bot },
  { name: "Feed", href: "/feed", icon: Users },
  { name: "Communities", href: "/communities", icon: Users },
]

export function MainNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, loading, supabaseConfigured } = useAuth()
  const [profile, setProfile] = useState<{ display_name?: string } | null>(null)
  const supabase = supabaseConfigured ? createClient() : null

  useEffect(() => {
    if (user && supabase) {
      const fetchProfile = async () => {
        const { data } = await supabase.from("profiles").select("display_name").eq("id", user.id).single()
        setProfile(data)
      }
      fetchProfile()
    }
  }, [user, supabase])

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut()
    }
    router.push("/")
  }

  // Don't show nav on landing, onboarding, or auth pages
  if (pathname === "/" || pathname === "/onboarding" || pathname.startsWith("/auth")) {
    return null
  }

  if (loading) {
    return null
  }

  if (!user) {
    return null
  }

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/pods" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">percent club</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = pathname.startsWith(item.href)

            return (
              <Button
                key={item.name}
                variant={isActive ? "secondary" : "ghost"}
                size="sm"
                asChild
                className={cn("gap-2", isActive && "bg-primary/10 text-primary")}
              >
                <Link href={item.href}>
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              </Button>
            )
          })}
        </nav>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-9 w-9 rounded-full cursor-pointer"
              aria-label="Open user menu"
            >
              <Avatar className="h-9 w-9">
                <AvatarImage src="/diverse-user-avatars.png" alt="User" className="pointer-events-none" draggable={false} />
                <AvatarFallback>
                  {profile?.display_name
                    ? profile.display_name.slice(0, 2).toUpperCase()
                    : user.email?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 z-50" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{profile?.display_name || user.email}</p>
                <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/about">About percent club</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/profile/me">
                <Avatar className="h-4 w-4 mr-2">
                  <AvatarFallback className="text-xs">
                    {profile?.display_name
                      ? profile.display_name.slice(0, 2).toUpperCase()
                      : user.email?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings">Edit Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t bg-background">
        <nav className="flex items-center justify-around py-2">
          {navigation.slice(0, 4).map((item) => {
            const Icon = item.icon
            const isActive = pathname.startsWith(item.href)

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 p-2 rounded-lg text-xs",
                  isActive ? "text-primary bg-primary/10" : "text-muted-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
