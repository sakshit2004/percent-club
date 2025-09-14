import { updateSession } from "@/lib/supabase/middleware"
import { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  if (process.env.NODE_ENV !== 'production') {
    console.log('🚀 MIDDLEWARE EXECUTED for:', request.nextUrl.pathname)
  }
  return await updateSession(request)
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|auth|about|offerings|how-it-works|pricing|learn|security|privacy|terms).*)",
  ],
}
