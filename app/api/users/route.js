import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import { successResponse, withErrorHandler, requireAdmin } from '@/lib/apiHelpers'

// GET /api/users
export const GET = withErrorHandler(async (request) => {
  const authResponse = requireAdmin(request)
  if (authResponse) return authResponse

  await connectDB()

  // Get current admin email from header to exclude them from the list
  const currentAdminEmail = request.headers.get('x-user-email')

  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q') || ''

  const filter = {}
  if (q) {
    filter.$or = [
      { name: { $regex: q, $options: 'i' } },
      { email: { $regex: q, $options: 'i' } }
    ]
  }

  if (currentAdminEmail) {
    filter.email = { $ne: currentAdminEmail }
  }

  const users = await User.find(filter)
    .select('name email role college branch createdAt')
    .sort({ createdAt: -1 })
    .lean()

  return NextResponse.json({ success: true, data: users })
})
