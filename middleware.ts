import { updateSession } from "@/lib/supabase/middleware"
import { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  if (process.env.NODE_ENV !== 'production') {
    console.log('🚀 MAIN MIDDLEWARE: Request received for:', request.nextUrl.pathname)
  }
  
  try {
    const result = await updateSession(request)
    if (process.env.NODE_ENV !== 'production') {
      console.log('🚀 MAIN MIDDLEWARE: Result type:', result.constructor.name)
    }
    return result
  } catch (error) {
    console.error('🚀 MAIN MIDDLEWARE ERROR:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}

export const config = {
  matcher: [
    // Match all routes except static files and images
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
