"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import { createContext, useContext, useEffect, useState } from "react"

interface AuthContextType {
  user: User | null
  loading: boolean
  supabaseConfigured: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  supabaseConfigured: false,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [supabaseConfigured, setSupabaseConfigured] = useState(false)

  useEffect(() => {
    try {
      const supabase = createClient()
      setSupabaseConfigured(true)

      // Get initial session
      const getInitialSession = async () => {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        setUser(session?.user ?? null)
        setLoading(false)
      }

      getInitialSession()

      // Listen for auth changes
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)

        // Handle onboarding data after successful signup confirmation
        if (event === "SIGNED_IN" && session?.user) {
          const onboardingData = localStorage.getItem("blossomOnboardingData")
          if (onboardingData) {
            try {
              const data = JSON.parse(onboardingData)

              // Update user profile with onboarding data
              await supabase.from("profiles").upsert({
                id: session.user.id,
                display_name: data.alias,
                agent_name: data.agentName,
              })

              // Create first pod if provided
              if (data.firstPod.name) {
                await supabase.from("pods").insert({
                  user_id: session.user.id,
                  name: data.firstPod.name,
                  target_amount: Number.parseFloat(data.firstPod.targetAmount),
                  target_date: data.firstPod.targetDate,
                })
              }

              // Clear onboarding data
              localStorage.removeItem("blossomOnboardingData")
            } catch (error) {
              console.error("Error processing onboarding data:", error)
            }
          }
        }
      })

      return () => subscription.unsubscribe()
    } catch (error) {
      console.log("[v0] Supabase not configured:", error)
      setSupabaseConfigured(false)
      setLoading(false)
    }
  }, [])

  return <AuthContext.Provider value={{ user, loading, supabaseConfigured }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
