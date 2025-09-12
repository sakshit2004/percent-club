import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  console.log(`[Supabase Middleware] Cookies for ${request.nextUrl.pathname}:`, request.cookies.getAll().map(c => `${c.name}=${c.value.substring(0, 20)}...`))
  console.log(`[Supabase Middleware] Environment check:`, {
    hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    url: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + '...'
  })
  
  let supabaseResponse = NextResponse.next({
    request,
  })

  // With Fluid compute, don't put this client in a global environment
  // variable. Always create a new one on each request.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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
  const {
    data: { user },
  } = await supabase.auth.getUser()

  console.log(`[Supabase Middleware] User check for ${request.nextUrl.pathname}:`, user ? 'authenticated' : 'not authenticated')

  // Define protected routes
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
    "/check-auth"
  ]

  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname === route || request.nextUrl.pathname.startsWith(route + "/")
  )

  console.log(`[Supabase Middleware] Route ${request.nextUrl.pathname} is protected:`, isProtectedRoute)

  if (!user && isProtectedRoute) {
    console.log(`[Supabase Middleware] Redirecting to login for protected route: ${request.nextUrl.pathname}`)
    // no user, potentially respond by redirecting the user to the login page
    const url = request.nextUrl.clone()
    url.pathname = "/auth/login"
    url.searchParams.set("redirect", request.nextUrl.pathname)
    return NextResponse.redirect(url)
  } else if (user && isProtectedRoute) {
    console.log(`[Supabase Middleware] User authenticated, allowing access to: ${request.nextUrl.pathname}`)
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
