import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Course from '@/models/Course'
import { errorResponse, withErrorHandler, requireAdmin } from '@/lib/apiHelpers'

// PUT /api/categories/[id]
export const PUT = withErrorHandler(async (request, props) => {
  const params = await props.params
  const authResponse = await requireAdmin(request)
  if (authResponse) return authResponse

  await connectDB()
  const body = await request.json()

  const existing = await Course.findOne({ slug: body.slug, _id: { $ne: params.id } })
  if (existing) {
    return errorResponse('Another course with this slug already exists', 409)
  }

  const updated = await Course.findByIdAndUpdate(
    params.id,
    { name: body.name, slug: body.slug, description: body.description },
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
