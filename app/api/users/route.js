import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import { successResponse, withErrorHandler, requireAdmin } from '@/lib/apiHelpers'

// GET /api/users
export const GET = withErrorHandler(async (request) => {
  const authResponse = await requireAdmin(request)
  if (authResponse) return authResponse

  await connectDB()

  const currentAdminEmail = request.headers.get('x-user-email')

  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q') || ''
  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 100)

  const filter = {}
  if (q) {
    filter.$or = [
      { name: { $regex: q, $options: 'i' } },
      { email: { $regex: q, $options: 'i' } },
    ]
  }
  // Exclude the currently logged-in admin from the list
  if (currentAdminEmail) {
    filter.email = { $ne: currentAdminEmail }
  }

  const [users, total] = await Promise.all([
    User.find(filter)
      .select('name email role college branch createdAt')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    User.countDocuments(filter),
  ])

  return successResponse({ users, total, page, limit })
})
