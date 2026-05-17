/**
 * Standardized API response helpers — always returns consistent JSON shape.
 */

export function successResponse(data, status = 200) {
  return Response.json({ success: true, data }, { status })
}

export function errorResponse(message, status = 500, details = null) {
  const body = { success: false, error: message }
  if (details) body.details = details
  return Response.json(body, { status })
}

/**
 * RBAC guard — checks that the caller is an authenticated admin.
 * Primary: reads x-user-role header sent by the client (AdminTable).
 * Fallback: verifies the JWT auth_token cookie set at login.
 */
export async function requireAdmin(request) {
  // 1. Check header first (sent by AdminTable client)
  const roleHeader = request.headers.get('x-user-role')
  if (roleHeader === 'admin') return null // ✅ allowed

  // 2. Fallback: verify the JWT cookie
  try {
    const { cookies } = await import('next/headers')
    const cookieStore = await cookies()
    const token = cookieStore.get('auth_token')?.value
    if (token) {
      const { jwtVerify } = await import('jose')
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret_for_development_only')
      const { payload } = await jwtVerify(token, secret)
      if (payload.role === 'admin') return null // ✅ allowed via cookie
    }
  } catch {
    // Invalid/missing cookie — fall through to 403
  }

  return errorResponse('Forbidden: Admin access required', 403)
}

/**
 * Wraps an async route handler in a try/catch, returning standardized errors.
 */
export function withErrorHandler(handler) {
  return async function (request, context) {
    try {
      return await handler(request, context)
    } catch (err) {
      console.error('[API Error]', err)
      if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map((e) => e.message)
        return errorResponse('Validation failed', 422, messages)
      }
      if (err.code === 11000) {
        return errorResponse('Duplicate entry — slug or email already exists', 409)
      }
      return errorResponse(err.message || 'Internal server error', 500)
    }
  }
}
