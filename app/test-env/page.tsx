"use client"

import { useEffect, useState } from "react"

export default function TestEnvPage() {
  const [envVars, setEnvVars] = useState<{
    hasUrl: boolean
    hasKey: boolean
    url: string
  }>({
    hasUrl: false,
    hasKey: false,
    url: ""
  })

  useEffect(() => {
    setEnvVars({
      hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      url: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + '...' || 'Not found'
    })
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Environment Variables Test</h1>
      <div className="space-y-2">
        <p>Has Supabase URL: {envVars.hasUrl ? '✅' : '❌'}</p>
        <p>Has Supabase Key: {envVars.hasKey ? '✅' : '❌'}</p>
        <p>URL Preview: {envVars.url}</p>
      </div>
    </div>
  )
}
