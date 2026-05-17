import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Course from '@/models/Course'
import { successResponse, errorResponse, withErrorHandler, requireAdmin } from '@/lib/apiHelpers'

// GET /api/categories
export const GET = withErrorHandler(async (request) => {
  await connectDB()
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q') || ''

  const filter = q ? { name: { $regex: q, $options: 'i' } } : {}
  const courses = await Course.find(filter).sort({ name: 1 }).lean()

  return NextResponse.json({ success: true, data: courses })
})

// POST /api/categories (Admin only)
export const POST = withErrorHandler(async (request) => {
  const authResponse = await requireAdmin(request)
  if (authResponse) return authResponse

  await connectDB()
  const body = await request.json()

  if (!body.name) {
    return errorResponse('Category name is required', 400)
  }

  // Pre-generate slug if not provided, just to check for duplicates safely
  const generatedSlug = body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')

  const existing = await Course.findOne({ slug: generatedSlug })
  if (existing) {
    return errorResponse('Category with this name or slug already exists', 409)
  }

  const newCourse = await Course.create({
    name: body.name,
    slug: generatedSlug,
    description: body.description || ''
  })

  return NextResponse.json({ success: true, data: newCourse }, { status: 201 })
})
