"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { User } from "@supabase/supabase-js"

export default function TestMiddlewarePage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createClient()
        const { data: { user }, error } = await supabase.auth.getUser()
        
        if (error) {
          setError(error.message)
        } else {
          setUser(user)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Middleware Test Page</h1>
      
      <div className="space-y-4">
        <div className="p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Authentication Status</h2>
          {error ? (
            <p className="text-red-500">Error: {error}</p>
          ) : user ? (
            <div>
              <p className="text-green-500">✅ Authenticated</p>
              <p>Email: {user.email}</p>
              <p>ID: {user.id}</p>
            </div>
          ) : (
            <p className="text-red-500">❌ Not authenticated</p>
          )}
        </div>

        <div className="p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Test Links</h2>
          <div className="space-y-2">
            <a href="/pods" className="block text-blue-500 hover:underline">Test /pods (should redirect to login)</a>
            <a href="/feed" className="block text-blue-500 hover:underline">Test /feed (should redirect to login)</a>
            <a href="/communities" className="block text-blue-500 hover:underline">Test /communities (should redirect to login)</a>
            <a href="/auth/login" className="block text-blue-500 hover:underline">Go to Login</a>
          </div>
        </div>
      </div>
    </div>
  )
}