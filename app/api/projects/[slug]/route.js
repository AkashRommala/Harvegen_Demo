import connectDB from '@/lib/mongodb'
import Project from '@/models/Project'
import { ProjectUpdateSchema } from '@/lib/validations'
import { successResponse, errorResponse, requireAdmin, withErrorHandler } from '@/lib/apiHelpers'

// GET /api/projects/[slug]
export const GET = withErrorHandler(async (_, props) => {
  const params = await props.params;
  await connectDB()
  const project = await Project.findOne({ slug: params.slug }).lean()
  if (!project) return errorResponse('Project not found', 404)
  return successResponse(project)
})

// PUT /api/projects/[slug]
export const PUT = withErrorHandler(async (request, props) => {
  const params = await props.params;
  const guard = requireAdmin(request)
  if (guard) return guard

  await connectDB()
  const body = await request.json()
  const parsed = ProjectUpdateSchema.safeParse(body)
  if (!parsed.success) {
    return errorResponse('Validation failed', 422, parsed.error.flatten().fieldErrors)
  }

  const project = await Project.findOneAndUpdate({ slug: params.slug }, parsed.data, {
    new: true,
    runValidators: true,
  })
  if (!project) return errorResponse('Project not found', 404)
  return successResponse(project)
})

// DELETE /api/projects/[slug]
export const DELETE = withErrorHandler(async (request, props) => {
  const params = await props.params;
  const guard = requireAdmin(request)
  if (guard) return guard

  await connectDB()
  const project = await Project.findOneAndDelete({ slug: params.slug })
  if (!project) return errorResponse('Project not found', 404)
  return successResponse({ message: 'Project deleted successfully' })
})
