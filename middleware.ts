import { updateSession } from "@/lib/supabase/middleware"
import { NextRequest, NextResponse } from "next/server"

export async function middleware(request: NextRequest) {
  if (process.env.NODE_ENV !== 'production') {
    console.log('🚀 MIDDLEWARE EXECUTED for:', request.nextUrl.pathname)
    console.log('🚀 MIDDLEWARE METHOD:', request.method)
    console.log('🚀 MIDDLEWARE HEADERS:', Object.fromEntries(request.headers.entries()))
  }
  
  try {
    return await updateSession(request)
  } catch (error) {
    console.error('🚀 MIDDLEWARE ERROR:', error)
    return NextResponse.next({ request })
  }
}

export const config = {
  matcher: [
    // Match all routes except static files and images
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
