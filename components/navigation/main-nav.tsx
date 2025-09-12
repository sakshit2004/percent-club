"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
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
import { Target, Zap, Bot, Users, Settings, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Pods", href: "/pods", icon: Target },
  { name: "Challenges", href: "/challenges", icon: Zap },
  { name: "Agent", href: "/agent", icon: Bot },
  { name: "Feed", href: "/feed", icon: Users },
  { name: "Communities", href: "/communities", icon: Users },
  // Marketing/Info pages
  { name: "About Us", href: "/about" },
  { name: "What We Offer", href: "/offerings" },
  { name: "How It Works", href: "/how-it-works" },
  { name: "Pricing", href: "/pricing" },
]

export function MainNav() {
  const pathname = usePathname()

  // Hide app nav on marketing and pre-auth pages
  const hideOn = [
    "/",
    "/onboarding",
    "/about",
    "/offerings",
    "/how-it-works",
    "/pricing",
    "/learn/challenges",
  ]
  if (
    pathname.startsWith("/auth") ||
    hideOn.some((p) => pathname === p || pathname.startsWith(p + "/"))
  ) {
    return null
  }

  // At this point, we are not on a public or auth page; middleware guards ensure access

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/pods" className="flex items-center gap-2">
          <Image src="/percentclub-logo.svg" alt="percent club logo" width={40} height={40} priority />
          <span className="text-xl font-bold">percent club</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navigation.map((item) => {
            const Icon = item.icon as any
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
                  {Icon ? <Icon className="h-4 w-4" /> : null}
                  {item.name}
                </Link>
              </Button>
            )
          })}
        </nav>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/diverse-user-avatars.png" alt="User" />
                <AvatarFallback>SC</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Sarah Chen</p>
                <p className="text-xs leading-none text-muted-foreground">@savingsstar</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile/me">
                <Avatar className="h-4 w-4 mr-2">
                  <AvatarFallback className="text-xs">SC</AvatarFallback>
                </Avatar>
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
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
