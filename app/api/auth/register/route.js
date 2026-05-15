import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import { RegisterSchema } from '@/lib/validations'
import { successResponse, errorResponse, withErrorHandler } from '@/lib/apiHelpers'

// POST /api/auth/register
export const POST = withErrorHandler(async (request) => {
  await connectDB()
  const body = await request.json()
  const parsed = RegisterSchema.safeParse(body)
  if (!parsed.success) {
    return errorResponse('Validation failed', 422, parsed.error.flatten().fieldErrors)
  }

  const { name, email, password } = parsed.data
  const existing = await User.findOne({ email })
  if (existing) return errorResponse('Email already registered', 409)

  const user = await User.create({ name, email, password })
  return successResponse(
    { id: user._id, name: user.name, email: user.email, role: user.role },
    201
  )
})
