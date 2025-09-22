import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  const isProd = process.env.NODE_ENV === 'production'
  
  // Define routes first
  const protectedRoutes = [
    "/pods",
    "/challenges",
    "/agent",
    "/feed",
    "/communities",
    "/settings",
    "/profile",
    "/saved",
    "/connect",
    "/onboarding"
  ]

  const publicRoutes = [
    "/",
    "/about",
    "/pricing",
    "/how-it-works",
    "/offerings",
    "/learn",
    "/security",
    "/auth/login",
    "/auth/sign-up",
    "/auth/sign-up-success",
    "/auth/error",
    "/test-env"
  ]

  const isProtectedRoute = protectedRoutes.some(route =>
    request.nextUrl.pathname === route || request.nextUrl.pathname.startsWith(route + "/")
  )

  const isPublicRoute = publicRoutes.some(route =>
    request.nextUrl.pathname === route || request.nextUrl.pathname.startsWith(route + "/")
  )

  if (!isProd) {
    console.log(`[Supabase Middleware] Processing request for: ${request.nextUrl.pathname}`)
    console.log(`[Supabase Middleware] Is protected route: ${isProtectedRoute}`)
    console.log(`[Supabase Middleware] Is public route: ${isPublicRoute}`)
  }

  // If it's a public route, allow access without authentication
  if (isPublicRoute) {
    if (!isProd) console.log(`[Supabase Middleware] ✅ PUBLIC ROUTE - Allowing access to: ${request.nextUrl.pathname}`)
    return NextResponse.next({ request })
  }

  // Check environment variables
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    if (!isProd) console.error('[Supabase Middleware] Missing environment variables!')
    // If env vars are missing and it's a protected route, redirect to login
    if (isProtectedRoute) {
      const url = request.nextUrl.clone()
      url.pathname = "/auth/login"
      url.searchParams.set("redirect", request.nextUrl.pathname)
      return NextResponse.redirect(url)
    }
    return NextResponse.next({ request })
  }

  // Create response
  let response = NextResponse.next({
    request,
  })

  // Create Supabase client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
        },
      },
    },
  )

  // Get user session
  let user = null
  try {
    const {
      data: { user: authUser },
      error
    } = await supabase.auth.getUser()

    if (error) {
      if (!isProd) console.error(`[Supabase Middleware] Auth error for ${request.nextUrl.pathname}:`, error.message)
    } else {
      user = authUser
    }
  } catch (error) {
    if (!isProd) console.error(`[Supabase Middleware] Auth exception for ${request.nextUrl.pathname}:`, error)
  }

  if (!isProd) console.log(`[Supabase Middleware] User check for ${request.nextUrl.pathname}:`, user ? `authenticated (${user.email})` : 'not authenticated')

  // Handle authentication for protected routes
  if (!user && isProtectedRoute) {
    if (!isProd) console.log(`[Supabase Middleware] ❌ NO USER - Redirecting to login for protected route: ${request.nextUrl.pathname}`)
    const url = request.nextUrl.clone()
    url.pathname = "/auth/login"
    url.searchParams.set("redirect", request.nextUrl.pathname)
    return NextResponse.redirect(url)
  } else if (user && isProtectedRoute) {
    if (!isProd) console.log(`[Supabase Middleware] ✅ USER AUTHENTICATED - Allowing access to: ${request.nextUrl.pathname}`)
  }

  // Handle redirect for authenticated users trying to access auth pages
  if (user && (request.nextUrl.pathname === "/auth/login" || request.nextUrl.pathname === "/auth/sign-up")) {
    if (!isProd) console.log(`[Supabase Middleware] Authenticated user trying to access auth page, redirecting to dashboard`)
    const url = request.nextUrl.clone()
    url.pathname = "/connect"
    return NextResponse.redirect(url)
  }

  // Handle redirect for authenticated users accessing sign-up-success
  if (user && request.nextUrl.pathname === "/auth/sign-up-success") {
    if (!isProd) console.log(`[Supabase Middleware] Authenticated user on sign-up-success, redirecting to dashboard`)
    const url = request.nextUrl.clone()
    url.pathname = "/connect"
    return NextResponse.redirect(url)
  }

  return response
}
