"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export default function ClearAuthPage() {
  const router = useRouter()

  useEffect(() => {
    const clearAuth = async () => {
      const supabase = createClient()
      
      // Sign out the user
      await supabase.auth.signOut()
      
      // Clear any local storage
      localStorage.clear()
      
      // Clear any session storage
      sessionStorage.clear()
      
      console.log('Auth cleared, redirecting to login...')
      
      // Redirect to login
      router.push('/auth/login')
    }

    clearAuth()
  }, [router])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Clearing Authentication...</h1>
      <p className="text-muted-foreground">
        Please wait while we clear your authentication state and redirect you to login.
      </p>
    </div>
  )
}
