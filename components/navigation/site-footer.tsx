import Link from "next/link"
import Image from "next/image"
import { Github, Twitter, Linkedin } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="mt-12 border-t border-white/10 bg-black text-white">
      <div className="container mx-auto px-4 py-10 grid gap-8 md:grid-cols-4">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Image src="/percentclub-logo.svg" alt="percent club logo" width={36} height={36} />
            <span className="text-lg font-semibold">percent club</span>
          </div>
          <p className="text-sm text-white/70 max-w-xs">
            Save smarter with Pods, Challenges, and your AI savings assistant.
          </p>
        </div>

        {/* Product */}
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white/80">Product</h3>
          <ul className="space-y-2 text-sm text-white/80">
            <li><Link href="/onboarding" className="hover:text-white">Pods</Link></li>
            <li><Link href="/onboarding" className="hover:text-white">Challenges</Link></li>
            <li><Link href="/onboarding" className="hover:text-white">AI Agent</Link></li>
            <li><Link href="/onboarding" className="hover:text-white">Communities</Link></li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white/80">Company</h3>
          <ul className="space-y-2 text-sm text-white/80">
            <li><Link href="/about" className="hover:text-white">About Us</Link></li>
            <li><Link href="/offerings" className="hover:text-white">What We Offer</Link></li>
            <li><Link href="/how-it-works" className="hover:text-white">How It Works</Link></li>
            <li><Link href="/learn/challenges" className="hover:text-white">Challenges</Link></li>
            <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white/80">Follow</h3>
          <div className="flex items-center gap-3">
            <a aria-label="Twitter" href="#" className="rounded-md p-2 hover:bg-white/10">
              <Twitter className="h-5 w-5" />
            </a>
            <a aria-label="GitHub" href="#" className="rounded-md p-2 hover:bg-white/10">
              <Github className="h-5 w-5" />
            </a>
            <a aria-label="LinkedIn" href="#" className="rounded-md p-2 hover:bg-white/10">
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-4 text-xs text-white/60 flex items-center justify-between">
          <span>© {new Date().getFullYear()} percent club</span>
          <div className="flex items-center gap-4">
            <Link href="#" className="hover:text-white">Privacy</Link>
            <Link href="#" className="hover:text-white">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
