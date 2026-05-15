import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import { LoginSchema } from '@/lib/validations'
import { successResponse, errorResponse, withErrorHandler } from '@/lib/apiHelpers'
import { SignJWT } from 'jose'
import { NextResponse } from 'next/server'

// POST /api/auth/login
export const POST = withErrorHandler(async (request) => {
  await connectDB()
  const body = await request.json()
  const parsed = LoginSchema.safeParse(body)
  if (!parsed.success) {
    return errorResponse('Validation failed', 422, parsed.error.flatten().fieldErrors)
  }

  const { email, password } = parsed.data
  const user = await User.findOne({ email }).select('+password')
  if (!user) return errorResponse('Invalid email or password', 401)

  const isMatch = await user.comparePassword(password)
  if (!isMatch) return errorResponse('Invalid email or password', 401)

  const userData = {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    bio: user.bio,
  }

  const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret_for_development_only')
  const alg = 'HS256'
  const token = await new SignJWT({ id: userData.id, role: userData.role })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret)

  const response = NextResponse.json({ success: true, data: userData }, { status: 200 })
  response.cookies.set({
    name: 'auth_token',
    value: token,
    httpOnly: true,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7 // 7 days
  })

  return response
})
