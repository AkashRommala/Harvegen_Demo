import connectDB from '@/lib/mongodb'
import Tutorial from '@/models/Tutorial'
import { TutorialSchema } from '@/lib/validations'
import { successResponse, errorResponse, requireAdmin, withErrorHandler } from '@/lib/apiHelpers'

// GET /api/tutorials
export const GET = withErrorHandler(async (request) => {
  await connectDB()
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const difficulty = searchParams.get('difficulty')
  const featured = searchParams.get('featured')
  const q = searchParams.get('q')
  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 100)

  const filter = {}
  if (category) filter.category = category
  if (difficulty) filter.difficulty = difficulty
  if (featured === 'true') filter.featured = true
  if (q) filter.$text = { $search: q }

  const [tutorials, total] = await Promise.all([
    Tutorial.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Tutorial.countDocuments(filter),
  ])

  return successResponse({ tutorials, total, page, limit })
})

// POST /api/tutorials
export const POST = withErrorHandler(async (request) => {
  const guard = requireAdmin(request)
  if (guard) return guard

  await connectDB()
  const body = await request.json()
  const parsed = TutorialSchema.safeParse(body)
  if (!parsed.success) {
    return errorResponse('Validation failed', 422, parsed.error.flatten().fieldErrors)
  }

  const tutorial = await Tutorial.create(parsed.data)
  return successResponse(tutorial, 201)
})
