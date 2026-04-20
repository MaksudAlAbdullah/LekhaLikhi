import { getSessionCookie } from "better-auth/cookies"
import { NextResponse, type NextRequest } from "next/server"

export const proxy = async (request: NextRequest) => {
  const sessionCookie = getSessionCookie(request)

  if (!sessionCookie) {
    const signInUrl = new URL("/sign-in", request.url)
    signInUrl.searchParams.set("callbackUrl", request.nextUrl.pathname)
    return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard", "/admin/:path*"],
}