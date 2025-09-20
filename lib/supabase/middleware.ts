import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  const isProd = process.env.NODE_ENV === 'production'
  if (!isProd) {
    console.log(`[Supabase Middleware] Processing request for: ${request.nextUrl.pathname}`)
    console.log(`[Supabase Middleware] Environment check:`, {
      hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      url: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + '...'
    })
  }
  
  let supabaseResponse = NextResponse.next({
    request,
  })

  // With Fluid compute, don't put this client in a global environment
  // variable. Always create a new one on each request.
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    if (!isProd) console.error('[Supabase Middleware] Missing environment variables!')
    return NextResponse.next({ request })
  }

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
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    },
  )

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: If you remove getUser() and you use server-side rendering
  // with the Supabase client, your users may be randomly logged out.
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

  // Define protected routes - all routes that require authentication
  const protectedRoutes = [
    "/pods",
    "/challenges", 
    "/agent",
    "/feed",
    "/communities",
    "/settings",
    "/profile",
    "/saved",
    "/test-middleware",
    "/check-auth",
    "/connect",
    "/onboarding",
    "/auth-test"
  ]

  // Define public routes that should be accessible without authentication
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
    "/clear-auth"
  ]

  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname === route || request.nextUrl.pathname.startsWith(route + "/")
  )

  const isPublicRoute = publicRoutes.some(route => 
    request.nextUrl.pathname === route || request.nextUrl.pathname.startsWith(route + "/")
  )

  if (!isProd) console.log(`[Supabase Middleware] Route ${request.nextUrl.pathname} is protected:`, isProtectedRoute, 'is public:', isPublicRoute)

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
    url.searchParams.delete("redirect")
    return NextResponse.redirect(url)
  }

  // Handle redirect for authenticated users accessing sign-up-success
  if (user && request.nextUrl.pathname === "/auth/sign-up-success") {
    if (!isProd) console.log(`[Supabase Middleware] Authenticated user on sign-up-success, redirecting to dashboard`)
    const url = request.nextUrl.clone()
    url.pathname = "/connect"
    return NextResponse.redirect(url)
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse
}
