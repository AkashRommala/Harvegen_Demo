import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Category from '@/models/Category'
import { errorResponse, withErrorHandler, requireAdmin } from '@/lib/apiHelpers'

// PUT /api/categories/[id]
export const PUT = withErrorHandler(async (request, props) => {
  const params = await props.params
  const authResponse = requireAdmin(request)
  if (authResponse) return authResponse

  await connectDB()
  const body = await request.json()

  const existing = await Category.findOne({ slug: body.slug, _id: { $ne: params.id } })
  if (existing) {
    return errorResponse('Another category with this slug already exists', 409)
  }

  const category = await Category.findByIdAndUpdate(params.id, body, { new: true, runValidators: true })
  if (!category) return errorResponse('Category not found', 404)

  return NextResponse.json({ success: true, data: category })
})

// DELETE /api/categories/[id]
export const DELETE = withErrorHandler(async (request, props) => {
  const params = await props.params
  const authResponse = requireAdmin(request)
  if (authResponse) return authResponse

  await connectDB()
  const category = await Category.findByIdAndDelete(params.id)
  if (!category) return errorResponse('Category not found', 404)

  return NextResponse.json({ success: true })
})
