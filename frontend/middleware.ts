import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const isPublicPath = path === "/" || path === "/sign-in" || path === "/sign-up"

  const token = request.cookies.get("user")?.value

  // Redirect to sign-in if accessing protected routes without authentication
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/sign-in", request.url))
  }

  // Redirect to products if already authenticated and trying to access auth pages
  if (isPublicPath && token && (path === "/sign-in" || path === "/sign-up")) {
    return NextResponse.redirect(new URL("/products", request.url))
  }

  // Check for admin routes
  if (path.startsWith("/admin")) {
    try {
      const user = token ? JSON.parse(token) : null
      if (!user || user.role !== "admin") {
        return NextResponse.redirect(new URL("/", request.url))
      }
    } catch (error) {
      return NextResponse.redirect(new URL("/sign-in", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/",
    "/sign-in",
    "/sign-up",
    "/products/:path*",
    "/cart",
    "/checkout/:path*",
    "/orders/:path*",
    "/admin/:path*",
  ],
}
