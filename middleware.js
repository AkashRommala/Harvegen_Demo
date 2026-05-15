import { NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret_for_development_only')

export async function middleware(request) {
  const path = request.nextUrl.pathname

  // 1. Protect /admin routes
  if (path.startsWith('/admin')) {
    const token = request.cookies.get('auth_token')?.value

    if (!token) {
      // User is not logged in -> redirect to home
      return NextResponse.redirect(new URL('/', request.url))
    }

    try {
      const { payload } = await jwtVerify(token, secret)
      
      if (payload.role !== 'admin') {
        // User is logged in but NOT an admin -> redirect to home
        return NextResponse.redirect(new URL('/', request.url))
      }
      
      // Allow access and attach headers so the backend APIs can also read the role seamlessly
      const response = NextResponse.next()
      response.headers.set('x-user-role', payload.role)
      response.headers.set('x-user-id', payload.id)
      return response

    } catch (err) {
      // Invalid token -> clear cookie and redirect
      const response = NextResponse.redirect(new URL('/', request.url))
      response.cookies.delete('auth_token')
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
