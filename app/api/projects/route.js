import connectDB from '@/lib/mongodb'
import Project from '@/models/Project'
import { ProjectSchema } from '@/lib/validations'
import { successResponse, errorResponse, requireAdmin, withErrorHandler } from '@/lib/apiHelpers'

// GET /api/projects — list with optional search/filter
export const GET = withErrorHandler(async (request) => {
  await connectDB()
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')
  const difficulty = searchParams.get('difficulty')
  const mcu = searchParams.get('mcu')
  const featured = searchParams.get('featured')
  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 100)

  const filter = {}
  if (q) filter.$text = { $search: q }
  if (difficulty) filter.difficulty = difficulty
  if (mcu) filter.mcu = { $regex: mcu, $options: 'i' }
  if (featured === 'true') filter.featured = true

  const [projects, total] = await Promise.all([
    Project.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Project.countDocuments(filter),
  ])

  return successResponse({ projects, total, page, limit })
})

// POST /api/projects — create (admin only)
export const POST = withErrorHandler(async (request) => {
  const guard = requireAdmin(request)
  if (guard) return guard

  await connectDB()
  const body = await request.json()
  const parsed = ProjectSchema.safeParse(body)
  if (!parsed.success) {
    return errorResponse('Validation failed', 422, parsed.error.flatten().fieldErrors)
  }

  const project = await Project.create(parsed.data)
  return successResponse(project, 201)
})
