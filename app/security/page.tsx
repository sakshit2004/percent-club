import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Lock, ShieldCheck, EyeOff, Check } from "lucide-react"

export default function SecurityPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section id="top" className="border-b bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Security & Privacy at percent club</h1>
          <p className="text-muted-foreground mb-6">Non‑custodial. Explicit consent. No public balances.</p>
          <div className="flex items-center justify-center gap-3 mb-6">
            <Badge variant="secondary">Non‑custodial</Badge>
            <Badge variant="secondary">Consent‑first</Badge>
            <Badge variant="secondary">Privacy by default</Badge>
          </div>
          <Button asChild size="lg">
            <Link href="#principles">Read our principles</Link>
          </Button>
        </div>
      </section>

      {/* Principles */}
      <section id="principles" className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base"><Lock className="h-5 w-5" /> Non‑custodial</CardTitle>
              <CardDescription>Your money stays in your bank</CardDescription>
            </CardHeader>
          </Card>
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base"><ShieldCheck className="h-5 w-5" /> Consent‑first</CardTitle>
              <CardDescription>You approve every action</CardDescription>
            </CardHeader>
          </Card>
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base"><EyeOff className="h-5 w-5" /> Privacy by default</CardTitle>
              <CardDescription>Public = alias + % only</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Data Access & Scopes */}
      <section id="data" className="container mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">Data access & scopes</h2>
        <div className="grid md:grid-cols-2 gap-6 text-sm">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">What we access</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-muted-foreground">
              <Item>Read‑only transactions for detection</Item>
              <Item>Basic profile (alias, email)</Item>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">What we never access</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-muted-foreground">
              <Item>Card numbers or credentials</Item>
              <Item>2FA codes or personal messages</Item>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Security measures */}
      <section id="security-measures" className="container mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">How we protect data</h2>
        <div className="grid md:grid-cols-3 gap-6 text-sm">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Encryption</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">In transit & at rest, modern TLS & AES standards.</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Access controls</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">Principle of least privilege; audit trails.</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Secrets management</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">Environment isolation and rotation.</CardContent>
          </Card>
        </div>
      </section>

      {/* User controls */}
      <section id="controls" className="container mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">User controls</h2>
        <div className="grid md:grid-cols-2 gap-6 text-sm">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Your choices</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-muted-foreground">
              <Item>Connect/revoke accounts anytime</Item>
              <Item>Approve/Pause/Undo actions where possible</Item>
              <Item>Export data (CSV)</Item>
              <Item>Delete account & data (email request)</Item>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Contact</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              Security contact: <Link href="mailto:security@percent.club" className="underline">security@percent.club</Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Compliance & disclosure */}
      <section id="compliance" className="container mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">Compliance & disclosure</h2>
        <div className="grid md:grid-cols-2 gap-6 text-sm">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">MVP stage</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">Aligning with best practices as we grow.</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Responsible disclosure</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">No bounty yet; safe‑harbor tone. Email us for any issues.</CardContent>
          </Card>
        </div>
      </section>

      {/* Transparency log */}
      <section id="transparency" className="container mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">Transparency log</h2>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <Card><CardHeader><CardTitle className="text-base">v0.1</CardTitle></CardHeader><CardContent className="text-muted-foreground">Added CSV export</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">v0.2</CardTitle></CardHeader><CardContent className="text-muted-foreground">Improved audit trails</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">v0.3</CardTitle></CardHeader><CardContent className="text-muted-foreground">Expanded subscription detection</CardContent></Card>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="container mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">FAQ</h2>
        <div className="grid md:grid-cols-2 gap-6 text-sm">
          <QA q="Do you move my money?" a="Never; we orchestrate only with permission." />
          <QA q="What do others see about me?" a="Alias & %; never balances or income." />
          <QA q="Can I revoke data access?" a="Yes—any time from your settings." />
          <QA q="How do I delete my data?" a="Use in‑app settings or email security@percent.club." />
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="container mx-auto px-4 pb-16 text-center">
        <div className="space-y-3">
          <p>Questions? We’ll answer. <Link className="underline" href="mailto:security@percent.club">Contact security</Link></p>
          <Button asChild>
            <Link href="/onboarding">Get started</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}

function Item({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /><span>{children}</span></div>
  )
}

function QA({ q, a }: { q: string; a: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{q}</CardTitle>
      </CardHeader>
      <CardContent className="text-muted-foreground">{a}</CardContent>
    </Card>
  )
}

