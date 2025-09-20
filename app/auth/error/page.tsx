"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCw, Home, LogIn } from "lucide-react"
import Link from "next/link"
import { AuthHeader } from "@/components/navigation/auth-header"
import { useSearchParams } from "next/navigation"

export default function Page() {
  const searchParams = useSearchParams()
  const error = searchParams?.get("error")
  const errorDescription = searchParams?.get("error_description")

  const getErrorMessage = () => {
    switch (error) {
      case "access_denied":
        return "Access was denied. You may have cancelled the authentication process."
      case "server_error":
        return "A server error occurred. Please try again later."
      case "temporarily_unavailable":
        return "The authentication service is temporarily unavailable. Please try again later."
      case "invalid_request":
        return "The authentication request was invalid. Please try again."
      default:
        return errorDescription || "An unexpected error occurred during authentication."
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <AuthHeader />
      <div className="container mx-auto px-4 py-10 flex items-center justify-center">
        <div className="w-full max-w-sm">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle className="text-2xl">Authentication Error</CardTitle>
              <CardDescription>
                Something went wrong with your authentication
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">
                  {getErrorMessage()}
                </p>
              </div>
              
              <div className="space-y-2">
                <Button asChild className="w-full">
                  <Link href="/auth/login">
                    <LogIn className="h-4 w-4 mr-2" />
                    Try Again
                  </Link>
                </Button>
                
                <Button asChild variant="outline" className="w-full">
                  <Link href="/">
                    <Home className="h-4 w-4 mr-2" />
                    Return to Home
                  </Link>
                </Button>
              </div>
              
              <div className="text-xs text-muted-foreground">
                <p>If this problem persists, please contact support.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
