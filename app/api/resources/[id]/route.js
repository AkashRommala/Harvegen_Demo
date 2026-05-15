import connectDB from '@/lib/mongodb'
import Resource from '@/models/Resource'
import { ResourceUpdateSchema } from '@/lib/validations'
import { successResponse, errorResponse, requireAdmin, withErrorHandler } from '@/lib/apiHelpers'

export const GET = withErrorHandler(async (_, props) => {
  const params = await props.params;
  await connectDB()
  const resource = await Resource.findById(params.id).lean()
  if (!resource) return errorResponse('Resource not found', 404)
  return successResponse(resource)
})

export const PUT = withErrorHandler(async (request, props) => {
  const params = await props.params;
  const guard = requireAdmin(request)
  if (guard) return guard

  await connectDB()
  const body = await request.json()
  const parsed = ResourceUpdateSchema.safeParse(body)
  if (!parsed.success) {
    return errorResponse('Validation failed', 422, parsed.error.flatten().fieldErrors)
  }

  const resource = await Resource.findByIdAndUpdate(params.id, parsed.data, {
    new: true,
    runValidators: true,
  })
  if (!resource) return errorResponse('Resource not found', 404)
  return successResponse(resource)
})

export const DELETE = withErrorHandler(async (request, props) => {
  const params = await props.params;
  const guard = requireAdmin(request)
  if (guard) return guard

  await connectDB()
  const resource = await Resource.findByIdAndDelete(params.id)
  if (!resource) return errorResponse('Resource not found', 404)
  return successResponse({ message: 'Resource deleted' })
})
