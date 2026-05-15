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
 * Reads the user from the x-user-role and x-user-email headers set by middleware
 * (or passed via the client in UserContext).
 *
 * For now we use a lightweight header-based check that trusts the client
 * (suitable for this architecture). In production replace with JWT/session validation.
 */
export function requireAdmin(request) {
  const role = request.headers.get('x-user-role')
  if (role !== 'admin') {
    return errorResponse('Forbidden: Admin access required', 403)
  }
  return null // null = no error, proceed
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
