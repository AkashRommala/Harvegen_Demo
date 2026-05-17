import connectDB from '@/lib/mongodb'
import Article from '@/models/Article'
import { ArticleSchema } from '@/lib/validations'
import { successResponse, errorResponse, requireAdmin, withErrorHandler } from '@/lib/apiHelpers'

// GET /api/articles
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
  if (q) {
    filter.$or = [
      { title: { $regex: q, $options: 'i' } },
      { description: { $regex: q, $options: 'i' } },
    ]
  }

  const [articles, total] = await Promise.all([
    Article.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Article.countDocuments(filter),
  ])

  return successResponse({ articles, total, page, limit })
})

// POST /api/articles
export const POST = withErrorHandler(async (request) => {
  const guard = await requireAdmin(request)
  if (guard) return guard

  await connectDB()
  const body = await request.json()
  const parsed = ArticleSchema.safeParse(body)
  if (!parsed.success) {
    return errorResponse('Validation failed', 422, parsed.error.flatten().fieldErrors)
  }

  const article = await Article.create(parsed.data)
  return successResponse(article, 201)
})
