import connectDB from '@/lib/mongodb'
import Resource from '@/models/Resource'
import { ResourceSchema } from '@/lib/validations'
import { successResponse, errorResponse, requireAdmin, withErrorHandler } from '@/lib/apiHelpers'

export const GET = withErrorHandler(async (request) => {
  await connectDB()
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type')
  const featured = searchParams.get('featured')
  const q = searchParams.get('q')
  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 100)

  const filter = {}
  if (type) filter.type = type
  if (featured === 'true') filter.featured = true
  if (q) filter.$text = { $search: q }

  const [resources, total] = await Promise.all([
    Resource.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    Resource.countDocuments(filter),
  ])

  return successResponse({ resources, total, page, limit })
})

export const POST = withErrorHandler(async (request) => {
  const guard = requireAdmin(request)
  if (guard) return guard

  await connectDB()
  const body = await request.json()
  const parsed = ResourceSchema.safeParse(body)
  if (!parsed.success) {
    return errorResponse('Validation failed', 422, parsed.error.flatten().fieldErrors)
  }

  const resource = await Resource.create(parsed.data)
  return successResponse(resource, 201)
})
