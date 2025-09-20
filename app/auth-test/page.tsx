"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { User } from "@supabase/supabase-js"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react"

export default function AuthTestPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [tests, setTests] = useState<Array<{
    name: string
    status: 'pending' | 'pass' | 'fail'
    message: string
  }>>([])
  const [runningTests, setRunningTests] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        if (error) throw error
        setUser(user)
      } catch (error) {
        console.error("Auth check failed:", error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const runAuthTests = async () => {
    setRunningTests(true)
    setTests([])

    const testResults: Array<{
      name: string
      status: 'pending' | 'pass' | 'fail'
      message: string
    }> = []

    // Test 1: Check if user is authenticated
    testResults.push({
      name: "User Authentication",
      status: 'pending',
      message: "Checking if user is authenticated..."
    })
    setTests([...testResults])

    if (user) {
      testResults[0] = {
        name: "User Authentication",
        status: 'pass',
        message: `User authenticated: ${user.email}`
      }
    } else {
      testResults[0] = {
        name: "User Authentication",
        status: 'fail',
        message: "No authenticated user found"
      }
    }
    setTests([...testResults])

    // Test 2: Check session validity
    testResults.push({
      name: "Session Validity",
      status: 'pending',
      message: "Checking session validity..."
    })
    setTests([...testResults])

    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) throw error
      
      if (session) {
        testResults[1] = {
          name: "Session Validity",
          status: 'pass',
          message: `Valid session expires at: ${new Date(session.expires_at! * 1000).toLocaleString()}`
        }
      } else {
        testResults[1] = {
          name: "Session Validity",
          status: 'fail',
          message: "No valid session found"
        }
      }
    } catch (error) {
      testResults[1] = {
        name: "Session Validity",
        status: 'fail',
        message: `Session check failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
    setTests([...testResults])

    // Test 3: Test protected route access
    testResults.push({
      name: "Protected Route Access",
      status: 'pending',
      message: "Testing protected route access..."
    })
    setTests([...testResults])

    try {
      const response = await fetch('/api/test-auth', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (response.ok) {
        testResults[2] = {
          name: "Protected Route Access",
          status: 'pass',
          message: "Successfully accessed protected API route"
        }
      } else {
        testResults[2] = {
          name: "Protected Route Access",
          status: 'fail',
          message: `Protected route access failed: ${response.status} ${response.statusText}`
        }
      }
    } catch (error) {
      testResults[2] = {
        name: "Protected Route Access",
        status: 'fail',
        message: `Protected route test failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
    setTests([...testResults])

    // Test 4: Test token refresh
    testResults.push({
      name: "Token Refresh",
      status: 'pending',
      message: "Testing token refresh capability..."
    })
    setTests([...testResults])

    try {
      const { data, error } = await supabase.auth.refreshSession()
      if (error) throw error
      
      testResults[3] = {
        name: "Token Refresh",
        status: 'pass',
        message: "Token refresh successful"
      }
    } catch (error) {
      testResults[3] = {
        name: "Token Refresh",
        status: 'fail',
        message: `Token refresh failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
    setTests([...testResults])

    // Test 5: Test sign out
    testResults.push({
      name: "Sign Out Functionality",
      status: 'pending',
      message: "Testing sign out functionality..."
    })
    setTests([...testResults])

    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      testResults[4] = {
        name: "Sign Out Functionality",
        status: 'pass',
        message: "Sign out successful - redirecting to login"
      }
      
      // Redirect to login after successful sign out
      setTimeout(() => {
        router.push('/auth/login')
      }, 2000)
    } catch (error) {
      testResults[4] = {
        name: "Sign Out Functionality",
        status: 'fail',
        message: `Sign out failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
    setTests([...testResults])

    setRunningTests(false)
  }

  const getStatusIcon = (status: 'pending' | 'pass' | 'fail') => {
    switch (status) {
      case 'pending':
        return <Loader2 className="h-4 w-4 animate-spin" />
      case 'pass':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'fail':
        return <XCircle className="h-4 w-4 text-red-500" />
    }
  }

  const getStatusBadge = (status: 'pending' | 'pass' | 'fail') => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline">Pending</Badge>
      case 'pass':
        return <Badge className="bg-green-500">Pass</Badge>
      case 'fail':
        return <Badge className="bg-red-500">Fail</Badge>
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Authentication Stress Test</h1>
          <p className="text-muted-foreground">
            Comprehensive testing of authentication flows, session management, and security.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Current Auth Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              {user ? (
                <div className="space-y-2">
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>ID:</strong> {user.id}</p>
                  <p><strong>Created:</strong> {new Date(user.created_at).toLocaleString()}</p>
                  <p><strong>Last Sign In:</strong> {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'N/A'}</p>
                </div>
              ) : (
                <p className="text-muted-foreground">No authenticated user</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Test Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={runAuthTests} 
                disabled={runningTests}
                className="w-full"
              >
                {runningTests ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Running Tests...
                  </>
                ) : (
                  'Run Authentication Tests'
                )}
              </Button>
              
              <div className="text-sm text-muted-foreground">
                <p>Tests will verify:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>User authentication status</li>
                  <li>Session validity and expiration</li>
                  <li>Protected route access</li>
                  <li>Token refresh capability</li>
                  <li>Sign out functionality</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {tests.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tests.map((test, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(test.status)}
                      <div>
                        <h4 className="font-medium">{test.name}</h4>
                        <p className="text-sm text-muted-foreground">{test.message}</p>
                      </div>
                    </div>
                    {getStatusBadge(test.status)}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
