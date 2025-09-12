"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

export default function CheckAuthPage() {
  const [authState, setAuthState] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        setAuthState({
          user,
          session,
          error,
          sessionError,
          cookies: document.cookie
        })
      } catch (err) {
        setAuthState({ error: err })
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Checking Authentication...</h1>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Authentication State</h1>
      <div className="bg-gray-100 p-4 rounded-lg">
        <pre className="text-sm overflow-auto">
          {JSON.stringify(authState, null, 2)}
        </pre>
      </div>
    </div>
  )
}
