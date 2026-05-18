import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Course from '@/models/Course'
import { errorResponse, withErrorHandler, requireAdmin } from '@/lib/apiHelpers'

export const PUT = withErrorHandler(async (request, props) => {
  const params = await props.params
  const authResponse = await requireAdmin(request)
  if (authResponse) return authResponse

  await connectDB()
  const body = await request.json()

  if (!body.name?.trim()) return errorResponse('Course name is required', 400)

  // Auto-regenerate slug from updated name
  const newSlug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')

  const existing = await Course.findOne({ slug: newSlug, _id: { $ne: params.id } })
  if (existing) {
    return errorResponse('Another course with this name already exists', 409)
  }

  const updated = await Course.findByIdAndUpdate(
    params.id,
    { name: body.name.trim(), slug: newSlug },
    { new: true, runValidators: true }
  )
  if (!updated) return errorResponse('Course not found', 404)

  return NextResponse.json({ success: true, data: updated })
})

// DELETE /api/categories/[id]
export const DELETE = withErrorHandler(async (request, props) => {
  const params = await props.params
  const authResponse = await requireAdmin(request)
  if (authResponse) return authResponse

  await connectDB()
  const course = await Course.findByIdAndDelete(params.id)
  if (!course) return errorResponse('Course not found', 404)

  return NextResponse.json({ success: true })
})
