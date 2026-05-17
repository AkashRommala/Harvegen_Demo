import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import { errorResponse, withErrorHandler, requireAdmin } from '@/lib/apiHelpers'

// PUT /api/users/[id] (To promote to admin)
export const PUT = withErrorHandler(async (request, props) => {
  const params = await props.params
  const authResponse = await requireAdmin(request)
  if (authResponse) return authResponse

  await connectDB()
  const body = await request.json()

  // Ensure only allowed fields are updated
  const updates = {}
  if (body.role && ['user', 'admin'].includes(body.role)) {
    updates.role = body.role
  }

  if (Object.keys(updates).length === 0) {
    return errorResponse('No valid fields to update', 400)
  }

  const user = await User.findByIdAndUpdate(params.id, updates, { new: true, runValidators: true }).select('-password')
  if (!user) return errorResponse('User not found', 404)

  return NextResponse.json({ success: true, data: user })
})

// DELETE /api/users/[id]
export const DELETE = withErrorHandler(async (request, props) => {
  const params = await props.params
  const authResponse = await requireAdmin(request)
  if (authResponse) return authResponse

  await connectDB()
  const user = await User.findByIdAndDelete(params.id)
  if (!user) return errorResponse('User not found', 404)

  return NextResponse.json({ success: true })
})
