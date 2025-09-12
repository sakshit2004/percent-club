import { NextResponse, type NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // Create a Supabase client using cookie adapters for middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          res.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          res.cookies.set({ name, value: "", ...options, expires: new Date(0) })
        },
      },
    }
  )
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const url = req.nextUrl

  // If the route is protected and the user isn't signed in, redirect to login
  const redirectToLogin = () => {
    const loginUrl = new URL("/auth/login", req.url)
    loginUrl.searchParams.set("redirect", url.pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Add protected routes here
  const isProtected = [
    "/pods",
    "/challenges",
    "/agent",
    "/feed",
    "/communities",
    "/settings",
    "/profile",
    "/saved",
  ].some((p) => url.pathname === p || url.pathname.startsWith(p + "/"))

  if (isProtected && !user) {
    return redirectToLogin()
  }

  return res
}

export const config = {
  matcher: [
    "/pods/:path*",
    "/challenges/:path*",
    "/agent/:path*",
    "/feed/:path*",
    "/communities/:path*",
    "/settings/:path*",
    "/profile/:path*",
    "/saved/:path*",
  ],
}
