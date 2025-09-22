import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import {
  ArrowRight,
  Menu,
  Sparkles,
} from "lucide-react"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { CursorEffect } from "@/components/common/cursor-effect"
import { GlowBadge } from "@/components/ui/glow-badge"
import { AnimatedTagline } from "@/components/ui/animated-tagline"

// Clean, focused landing page components
import { HeroLonniee } from "@/components/landing/hero-lonniee"
import { CommunitySpotlight } from "@/components/landing/community-spotlight"
import { MeetLonniee } from "@/components/landing/meet-lonniee"
import { HowItWorksCommunity } from "@/components/landing/how-it-works-community"
import { CtaBand } from "@/components/landing/cta-band"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black relative">
      <CursorEffect />
      {/* Header */}
      <header className="sticky top-0 z-50">
        <div className="absolute inset-0 bg-black/80 backdrop-blur-xl border-b border-white/10"></div>
        <div className="relative container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Image src="/percentclub-logo.svg" alt="percent club logo" width={40} height={40} priority />
              <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-sm"></div>
            </div>
            <span className="text-xl font-bold text-white tracking-tight">percent club</span>
          </div>
          
          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/#communities" className="text-sm text-white/80 hover:text-blue-400 transition-colors flex items-center gap-1">
              <span>Communities</span>
              <span className="text-xs text-blue-400/60">Public</span>
                  </Link>
            <Link href="/feed" className="text-sm text-white/80 hover:text-white transition-colors">Feed</Link>
            <Link href="/#lonniee" className="text-sm text-white/80 hover:text-emerald-400 transition-colors flex items-center gap-1">
              <span>Lonniee</span>
              <span className="text-xs text-emerald-400/60">Private</span>
                  </Link>
            <Link href="/#how-it-works" className="text-sm text-white/80 hover:text-white transition-colors">How It Works</Link>
            <Link href="/pricing" className="text-sm text-white/80 hover:text-white transition-colors">Pricing</Link>
            <Link href="/about" className="text-sm text-white/80 hover:text-white transition-colors">About</Link>
            <Link href="/security" className="text-sm text-white/80 hover:text-white transition-colors">Security</Link>
          </div>

          {/* Mobile: hamburger menu */}
          <div className="md:hidden">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu" className="text-white">
                  <Menu className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="p-0 max-w-sm bg-black/95 backdrop-blur-xl border-white/10">
                <div className="p-4 space-y-2">
                  <Link href="/#communities" className="block px-3 py-2 rounded-md hover:bg-blue-500/10 text-white border-l-2 border-blue-500">
                    <div className="flex items-center justify-between">
                      <span>Communities</span>
                      <span className="text-xs text-blue-400">Public</span>
                    </div>
                  </Link>
                  <Link href="/#lonniee" className="block px-3 py-2 rounded-md hover:bg-emerald-500/10 text-white border-l-2 border-emerald-500">
                    <div className="flex items-center justify-between">
                      <span>Lonniee</span>
                      <span className="text-xs text-emerald-400">Private</span>
                    </div>
                  </Link>
                  <Link href="/feed" className="block px-3 py-2 rounded-md hover:bg-white/5 text-white">Feed</Link>
                  <Link href="/#how-it-works" className="block px-3 py-2 rounded-md hover:bg-white/5 text-white">How It Works</Link>
                  <Link href="/pricing" className="block px-3 py-2 rounded-md hover:bg-white/5 text-white">Pricing</Link>
                  <Link href="/about" className="block px-3 py-2 rounded-md hover:bg-white/5 text-white">About</Link>
                  <Link href="/security" className="block px-3 py-2 rounded-md hover:bg-white/5 text-white">Security</Link>
                </div>
                <div className="sticky bottom-0 p-4 border-t border-white/10 space-y-2">
                  <Button variant="ghost" asChild className="w-full text-white/80 hover:text-white hover:bg-white/5">
                    <Link href="/auth/login">Sign In</Link>
                  </Button>
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-lg blur-sm opacity-75 animate-pulse"></div>
                    <Button asChild className="relative w-full bg-blue-600 hover:bg-blue-700 text-white border-2 border-blue-400/50 shadow-lg">
                      <Link href="/auth/sign-up">Join percent club</Link>
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Right actions (desktop) */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" asChild className="text-white/80 hover:text-white hover:bg-white/5">
              <Link href="/auth/login">Sign In</Link>
            </Button>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-lg blur-sm opacity-75 animate-pulse"></div>
              <Button asChild className="relative bg-blue-600 hover:bg-blue-700 text-white border-2 border-blue-400/50 shadow-lg">
                <Link href="/auth/sign-up">Join percent club</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Community First */}
      <HeroLonniee />

      {/* Community Spotlight */}
      <CommunitySpotlight />

      {/* Meet Lonniee - Private Finance Coach */}
      <MeetLonniee />

      {/* How It Works - Community & Challenges */}
      <HowItWorksCommunity />


      {/* Final CTA Section */}
      <CtaBand />

      {/* Trust Strip */}
      <div className="border-t border-white/10 bg-black/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-white/60 text-sm">
            Read-only. We never move money. Disconnect anytime.
          </p>
        </div>
      </div>

      {/* Footer moved to global layout via <SiteFooter /> */}
    </div>
  )
}