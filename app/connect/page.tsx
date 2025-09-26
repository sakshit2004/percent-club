"use client"

import { PlaidConnectButton } from "@/components/plaid/connect-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ConnectBankPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <Card>
          <CardHeader>
            <CardTitle>Connect your bank</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Link your account to enable Round-Ups, subscription insights, and real savings automation.
            </p>
            <PlaidConnectButton />
            <div className="text-xs text-muted-foreground">Sandbox is supported. You can add a test institution now.</div>
            <div className="pt-2">
              <Button variant="outline" asChild className="bg-transparent">
                <Link href="/agent">Skip for now</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


