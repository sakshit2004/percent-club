"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { useState, useEffect, useMemo, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Target, 
  Zap, 
  Bot, 
  Users, 
  Settings, 
  LogOut, 
  User, 
  Bookmark, 
  Bell, 
  Download, 
  HelpCircle,
  ChevronDown,
  X
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

const navigation = [
  { name: "Pods", href: "/pods", icon: Target },
  { name: "Challenges", href: "/challenges", icon: Zap },
  { name: "Lonniee", href: "/agent", icon: Bot },
  { name: "Feed", href: "/feed", icon: Users },
  { name: "Communities", href: "/communities", icon: Users },
]

// Empty user data - will be populated from API
const mockUser = {
  alias: "User",
  handle: "user",
  avatar: "/placeholder-user.jpg",
  level: 1,
  followersCount: 0,
  followingCount: 0,
  savedPostsCount: 0,
  joinedCommunitiesCount: 0,
}

export function MainNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobile, setIsMobile] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showDesktopMenu, setShowDesktopMenu] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const { toast } = useToast()
  const [isBankLinked, setIsBankLinked] = useState<boolean>(false)
  const [showBankMenu, setShowBankMenu] = useState<boolean>(false)

  // Check for mobile - optimized with debouncing
  useEffect(() => {
    let timeoutId: NodeJS.Timeout
    const checkMobile = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        const isMobileScreen = window.innerWidth < 768
        setIsMobile(isMobileScreen)
      }, 100) // Debounce resize events
    }
    
    // Initial check
    const isMobileScreen = window.innerWidth < 768
    setIsMobile(isMobileScreen)
    
    window.addEventListener('resize', checkMobile)
    return () => {
      window.removeEventListener('resize', checkMobile)
      clearTimeout(timeoutId)
    }
  }, [])
  // Lightweight "bank linked" check via presence of any plaid_items (stored client-side hint)
  useEffect(() => {
    // Set by PlaidConnectButton after successful link
    const flag = localStorage.getItem("bank_linked") === "1"
    setIsBankLinked(flag)
    const i = setInterval(() => setIsBankLinked(localStorage.getItem("bank_linked") === "1"), 5000)
    return () => clearInterval(i)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showDesktopMenu) {
        const target = event.target as Element
        if (!target.closest('.profile-dropdown')) {
          setShowDesktopMenu(false)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showDesktopMenu])

  const handleLogout = () => {
    // Clear any stored auth data (localStorage, cookies, etc.)
    localStorage.removeItem('auth-token')
    // Redirect to main/landing page
    router.push('/')
    toast({
      title: "Signed out",
      description: "You've been successfully signed out.",
    })
  }

  const handleExportData = () => {
    toast({
      title: "Export requested",
      description: "We'll email you a download link within 24 hours.",
    })
  }

  const handleShareProfile = () => {
    navigator.clipboard.writeText(`${window.location.origin}/profile/${mockUser.handle}`)
    toast({
      title: "Profile shared",
      description: "Profile link copied to clipboard.",
    })
  }

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
    <>
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link href="/pods" className="flex items-center gap-2">
            <Image src="/percentclub-logo.svg" alt="percent club logo" width={40} height={40} priority />
            <span className="text-xl font-bold">percent club</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-3">
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
            {isBankLinked ? (
              <div className="relative">
                <Button
                  variant="ghost"
                  className="ml-2 px-0"
                  type="button"
                  onClick={() => setShowBankMenu((v) => !v)}
                >
                  <Badge variant="success" className="px-3 py-1 text-sm">Bank linked</Badge>
                  <ChevronDown className="h-4 w-4 ml-1 text-muted-foreground" />
                </Button>
                {showBankMenu && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 border rounded-md shadow-lg z-50">
                    <button
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-sm"
                      onClick={() => { setShowBankMenu(false); router.push('/connect'); }}
                    >
                      <Users className="h-4 w-4" />
                      Link another bank
                    </button>
                    <button
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-sm text-red-600"
                      onClick={async () => {
                        try {
                          const res = await fetch('/api/plaid/unlink', { method: 'POST' })
                          if (!res.ok) throw new Error(await res.text())
                          localStorage.removeItem('bank_linked')
                          setIsBankLinked(false)
                          setShowBankMenu(false)
                          toast({ title: 'Bank unlinked' })
                        } catch (e) {
                          toast({ title: 'Failed to unlink', variant: 'destructive' })
                        }
                      }}
                    >
                      <LogOut className="h-4 w-4" />
                      Unlink bank
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/connect" className="ml-2">
                <Badge className="px-3 py-1 text-sm">Connect bank</Badge>
              </Link>
            )}
          </nav>

          {/* User Menu - Desktop */}
          <div className="hidden md:block">
            {/* Custom Dropdown - More Reliable */}
            <div className="relative profile-dropdown">
              <Button 
                variant="ghost" 
                className="relative h-8 w-8 rounded-full"
                onClick={() => setShowDesktopMenu(!showDesktopMenu)}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={mockUser.avatar} alt="User" />
                  <AvatarFallback>{mockUser.alias[0]}</AvatarFallback>
                </Avatar>
              </Button>
              
              {/* Custom Dropdown Menu */}
              {showDesktopMenu && (
                <div className="absolute right-0 top-10 w-64 bg-background border rounded-lg shadow-lg z-50">
                  {/* User Info */}
                  <div className="p-4 border-b">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={mockUser.avatar} />
                        <AvatarFallback>{mockUser.alias[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium leading-none">{mockUser.alias}</p>
                          <Badge variant="outline" className="text-xs">L{mockUser.level}</Badge>
                        </div>
                        <p className="text-xs leading-none text-muted-foreground mt-1">@{mockUser.handle}</p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <Link href="/profile/me" className="flex items-center gap-3 px-4 py-2 hover:bg-muted" onClick={() => setShowDesktopMenu(false)}>
                      <User className="h-4 w-4" />
                      <span>View Profile</span>
                    </Link>
                    <Link href="/settings" className="flex items-center gap-3 px-4 py-2 hover:bg-muted" onClick={() => setShowDesktopMenu(false)}>
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                    <Link href="/pods" className="flex items-center gap-3 px-4 py-2 hover:bg-muted" onClick={() => setShowDesktopMenu(false)}>
                      <Target className="h-4 w-4" />
                      <span>My Pods</span>
                    </Link>
                    <Link href="/agent" className="flex items-center gap-3 px-4 py-2 hover:bg-muted" onClick={() => setShowDesktopMenu(false)}>
                      <Image src="/Looniee-logo-main.svg" alt="Looniee AI" width={16} height={16} className="w-4 h-4 object-contain" />
                      <span>My Agent</span>
                    </Link>
                  </div>

                  <div className="border-t py-2">
                    <Link href="/profile/me/followers" className="flex items-center gap-3 px-4 py-2 hover:bg-muted" onClick={() => setShowDesktopMenu(false)}>
                      <Users className="h-4 w-4" />
                      <span>Followers ({mockUser.followersCount})</span>
                    </Link>
                    <Link href="/profile/me/following" className="flex items-center gap-3 px-4 py-2 hover:bg-muted" onClick={() => setShowDesktopMenu(false)}>
                      <Users className="h-4 w-4" />
                      <span>Following ({mockUser.followingCount})</span>
                    </Link>
                    <Link href="/saved" className="flex items-center gap-3 px-4 py-2 hover:bg-muted" onClick={() => setShowDesktopMenu(false)}>
                      <Bookmark className="h-4 w-4" />
                      <span>Saved Posts ({mockUser.savedPostsCount})</span>
                    </Link>
                    <Link href="/communities" className="flex items-center gap-3 px-4 py-2 hover:bg-muted" onClick={() => setShowDesktopMenu(false)}>
                      <Users className="h-4 w-4" />
                      <span>Communities ({mockUser.joinedCommunitiesCount})</span>
                    </Link>
                  </div>

                  <div className="border-t py-2">
                    <Link href="/settings#notifications" className="flex items-center gap-3 px-4 py-2 hover:bg-muted" onClick={() => setShowDesktopMenu(false)}>
                      <Bell className="h-4 w-4" />
                      <span>Notifications</span>
                    </Link>
                    <button onClick={() => { handleExportData(); setShowDesktopMenu(false); }} className="flex items-center gap-3 px-4 py-2 hover:bg-muted w-full text-left">
                      <Download className="h-4 w-4" />
                      <span>Export my data</span>
                    </button>
                    <Link href="/help" className="flex items-center gap-3 px-4 py-2 hover:bg-muted" onClick={() => setShowDesktopMenu(false)}>
                      <HelpCircle className="h-4 w-4" />
                      <span>Help & support</span>
                    </Link>
                  </div>

                  <div className="border-t py-2">
                    <button 
                      onClick={() => { setShowLogoutConfirm(true); setShowDesktopMenu(false); }} 
                      className="flex items-center gap-3 px-4 py-2 hover:bg-muted w-full text-left text-destructive"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign out</span>
                    </button>
                  </div>

                  {/* Privacy Note */}
                  <div className="px-4 py-2 border-t bg-muted/50">
                    <p className="text-xs text-muted-foreground">
                      Public shows alias & % only. Balances stay private.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* User Menu - Mobile */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              className="relative h-8 w-8 rounded-full"
              onClick={() => setShowMobileMenu(true)}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={mockUser.avatar} alt="User" />
                <AvatarFallback>{mockUser.alias[0]}</AvatarFallback>
              </Avatar>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t bg-background">
          <nav className="flex items-center justify-around py-2">
            {navigation.map((item) => {
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

      {/* Mobile Bottom Sheet */}
      <Dialog open={showMobileMenu} onOpenChange={setShowMobileMenu}>
        <DialogContent className="max-w-md mx-auto rounded-t-2xl">
          <DialogHeader className="pb-4">
            <div className="flex items-center justify-between">
              <DialogTitle>Menu</DialogTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowMobileMenu(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* User Info */}
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Avatar className="h-12 w-12">
                <AvatarImage src={mockUser.avatar} />
                <AvatarFallback>{mockUser.alias[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{mockUser.alias}</p>
                  <Badge variant="outline" className="text-xs">L{mockUser.level}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">@{mockUser.handle}</p>
              </div>
            </div>

            {/* Primary Actions */}
            <div className="space-y-2">
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/profile/me" onClick={() => setShowMobileMenu(false)}>
                  <User className="h-4 w-4 mr-3" />
                  View Profile
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/settings" onClick={() => setShowMobileMenu(false)}>
                  <Settings className="h-4 w-4 mr-3" />
                  Settings
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/pods" onClick={() => setShowMobileMenu(false)}>
                  <Target className="h-4 w-4 mr-3" />
                  My Pods
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/agent" onClick={() => setShowMobileMenu(false)}>
                  <Image src="/Looniee-logo-main.svg" alt="Looniee AI" width={16} height={16} className="w-4 h-4 object-contain mr-3" />
                  My Agent
                </Link>
              </Button>
            </div>

            {/* Social & Content */}
            <div className="space-y-2">
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/profile/me/followers" onClick={() => setShowMobileMenu(false)}>
                  <Users className="h-4 w-4 mr-3" />
                  Followers ({mockUser.followersCount})
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/profile/me/following" onClick={() => setShowMobileMenu(false)}>
                  <Users className="h-4 w-4 mr-3" />
                  Following ({mockUser.followingCount})
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/saved" onClick={() => setShowMobileMenu(false)}>
                  <Bookmark className="h-4 w-4 mr-3" />
                  Saved Posts ({mockUser.savedPostsCount})
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/communities" onClick={() => setShowMobileMenu(false)}>
                  <Users className="h-4 w-4 mr-3" />
                  Communities ({mockUser.joinedCommunitiesCount})
                </Link>
              </Button>
            </div>

            {/* Admin & Support */}
            <div className="space-y-2">
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/settings#notifications" onClick={() => setShowMobileMenu(false)}>
                  <Bell className="h-4 w-4 mr-3" />
                  Notifications
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" onClick={handleExportData}>
                <Download className="h-4 w-4 mr-3" />
                Export my data
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/help" onClick={() => setShowMobileMenu(false)}>
                  <HelpCircle className="h-4 w-4 mr-3" />
                  Help & support
                </Link>
              </Button>
            </div>

            {/* Sign Out */}
            <div className="pt-4 border-t">
              <Button 
                variant="ghost" 
                className="w-full justify-start text-destructive hover:text-destructive" 
                onClick={() => {
                  setShowMobileMenu(false)
                  setShowLogoutConfirm(true)
                }}
              >
                <LogOut className="h-4 w-4 mr-3" />
                Sign out
              </Button>
            </div>

            {/* Privacy Note */}
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground text-center">
                Public shows alias & % only. Balances stay private.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Logout Confirmation */}
      <Dialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign out</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to sign out? You'll need to sign in again to access your account.
            </p>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowLogoutConfirm(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleLogout}>
                Sign out
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
