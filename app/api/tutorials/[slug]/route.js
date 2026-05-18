import connectDB from '@/lib/mongodb'
import Tutorial from '@/models/Tutorial'
import Article from '@/models/Article' // required for populate('articles') to resolve
import { TutorialUpdateSchema } from '@/lib/validations'
import { successResponse, errorResponse, requireAdmin, withErrorHandler } from '@/lib/apiHelpers'

export const GET = withErrorHandler(async (request, props) => {
  const params = await props.params;
  await connectDB()
  const tutorial = await Tutorial.findOne({ slug: params.slug })
    .populate('articles')
    .lean()
    
  if (!tutorial) return errorResponse('Tutorial not found', 404)
  return successResponse(tutorial)
})

export const PUT = withErrorHandler(async (request, props) => {
  const params = await props.params;
  const guard = await requireAdmin(request)
  if (guard) return guard

  await connectDB()
  const body = await request.json()
  const parsed = TutorialUpdateSchema.safeParse(body)
  if (!parsed.success) {
    return errorResponse('Validation failed', 422, parsed.error.flatten().fieldErrors)
  }

  const tutorial = await Tutorial.findOneAndUpdate({ slug: params.slug }, parsed.data, {
    new: true,
    runValidators: true,
  })
  if (!tutorial) return errorResponse('Tutorial not found', 404)
  return successResponse(tutorial)
})

export const DELETE = withErrorHandler(async (request, props) => {
  const params = await props.params;
  const guard = await requireAdmin(request)
  if (guard) return guard

  await connectDB()
  const tutorial = await Tutorial.findOneAndDelete({ slug: params.slug })
  if (!tutorial) return errorResponse('Tutorial not found', 404)
  return successResponse({ message: 'Tutorial deleted successfully' })
})
