"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Github, Twitter, Linkedin, Mail, HelpCircle, Shield, FileText } from "lucide-react"

export function SiteFooter() {
  const pathname = usePathname()
  
  // Check if user is on a protected page (authenticated)
  const isAuthenticated = !pathname.startsWith("/auth") && 
    !pathname.startsWith("/") && 
    !pathname.startsWith("/about") && 
    !pathname.startsWith("/offerings") && 
    !pathname.startsWith("/how-it-works") && 
    !pathname.startsWith("/pricing") && 
    !pathname.startsWith("/learn") &&
    !pathname.startsWith("/security") &&
    !pathname.startsWith("/privacy") &&
    !pathname.startsWith("/terms")
  return (
    <footer className="mt-12 border-t bg-background">
      <div className="container mx-auto px-4 py-10 grid gap-8 md:grid-cols-4">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Image src="/percentclub-logo.svg" alt="percent club logo" width={36} height={36} />
            <span className="text-lg font-semibold">percent club</span>
          </div>
          <p className="text-sm text-muted-foreground max-w-xs">
            Save smarter with Pods, Challenges, and your AI savings assistant. Privacy-first, non-custodial savings.
          </p>
        </div>

        {/* Product */}
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-foreground">Product</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link 
                href={isAuthenticated ? "/pods" : "/auth/login"} 
                className="hover:text-foreground transition-colors"
              >
                Pods
              </Link>
            </li>
            <li>
              <Link 
                href={isAuthenticated ? "/challenges" : "/auth/login"} 
                className="hover:text-foreground transition-colors"
              >
                Challenges
              </Link>
            </li>
            <li>
              <Link 
                href={isAuthenticated ? "/agent" : "/auth/login"} 
                className="hover:text-foreground transition-colors"
              >
                AI Agent
              </Link>
            </li>
            <li>
              <Link 
                href={isAuthenticated ? "/feed" : "/auth/login"} 
                className="hover:text-foreground transition-colors"
              >
                Feed
              </Link>
            </li>
            <li>
              <Link 
                href={isAuthenticated ? "/communities" : "/auth/login"} 
                className="hover:text-foreground transition-colors"
              >
                Communities
              </Link>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-foreground">Support</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/security" className="hover:text-foreground transition-colors">Security</Link></li>
            <li>
              <Link 
                href={isAuthenticated ? "/settings" : "/auth/login"} 
                className="hover:text-foreground transition-colors"
              >
                Settings
              </Link>
            </li>
            <li><Link href="mailto:support@percentclub.com" className="hover:text-foreground transition-colors">Contact Us</Link></li>
          </ul>
        </div>

        {/* Legal & Social */}
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-foreground">Connect</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <a aria-label="Twitter" href="https://twitter.com/percentclub" target="_blank" rel="noopener noreferrer" className="rounded-md p-2 hover:bg-muted transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a aria-label="GitHub" href="https://github.com/percentclub" target="_blank" rel="noopener noreferrer" className="rounded-md p-2 hover:bg-muted transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a aria-label="LinkedIn" href="https://linkedin.com/company/percentclub" target="_blank" rel="noopener noreferrer" className="rounded-md p-2 hover:bg-muted transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
            <div className="text-xs text-muted-foreground">
              <p>Non-custodial • Privacy-first</p>
              <p>Public shows % only</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t">
        <div className="container mx-auto px-4 py-4 text-xs text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>© {new Date().getFullYear()} percent club. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-foreground transition-colors flex items-center gap-1">
              <Shield className="h-3 w-3" />
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors flex items-center gap-1">
              <FileText className="h-3 w-3" />
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
