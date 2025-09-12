"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { usePlaidLink } from "react-plaid-link"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export function PlaidConnectButton() {
  const { toast } = useToast()
  const [linkToken, setLinkToken] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  const fetchLinkToken = useCallback(async () => {
    try {
      setIsCreating(true)
      const res = await fetch("/api/plaid/link-token", { method: "POST" })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      setLinkToken(data.link_token)
    } catch (e: any) {
      toast({ title: "Plaid error", description: e?.message || "Failed to create link token", variant: "destructive" })
    } finally {
      setIsCreating(false)
    }
  }, [toast])

  useEffect(() => {
    fetchLinkToken()
  }, [fetchLinkToken])

  const config = useMemo(() => {
    if (!linkToken) return null
    return {
      token: linkToken,
      onSuccess: async (public_token: string, metadata: any) => {
        try {
          const res = await fetch("/api/plaid/exchange", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ public_token, institution_name: metadata?.institution?.name }),
          })
          if (!res.ok) throw new Error(await res.text())
          toast({ title: "Bank linked", description: "Syncing transactions..." })
          // Trigger a sync
          const syncRes = await fetch("/api/sync/transactions", { method: "POST" })
          if (!syncRes.ok) throw new Error(await syncRes.text())
          toast({ title: "Transactions synced" })
          // Set client-side flag so nav can show indicator
          localStorage.setItem("bank_linked", "1")
        } catch (e: any) {
          toast({ title: "Error", description: e?.message || "Failed to link account", variant: "destructive" })
        }
      },
      onExit: async () => {
        // Optionally refresh token
      },
    }
  }, [linkToken, toast]) as any

  const { open, ready } = usePlaidLink(config || { token: "" })

  return (
    <Button onClick={() => open()} disabled={!ready || !linkToken || isCreating}>
      {isCreating ? "Preparing..." : "Connect bank"}
    </Button>
  )
}


