import connectDB from '@/lib/mongodb'
import Lead from '@/models/Lead'
import { successResponse, errorResponse, requireAdmin, withErrorHandler } from '@/lib/apiHelpers'

export const PATCH = withErrorHandler(async (request, props) => {
  const params = await props.params;
  const guard = await requireAdmin(request)
  if (guard) return guard

  await connectDB()
  const { status } = await request.json()
  const validStatuses = ['new', 'read', 'replied', 'archived']
  if (!validStatuses.includes(status)) {
    return errorResponse('Invalid status value', 422)
  }

  const lead = await Lead.findByIdAndUpdate(params.id, { status }, { new: true })
  if (!lead) return errorResponse('Lead not found', 404)
  return successResponse(lead)
})

// DELETE /api/contact/[id] — admin only
export const DELETE = withErrorHandler(async (request, props) => {
  const params = await props.params;
  const guard = await requireAdmin(request)
  if (guard) return guard

  await connectDB()
  const lead = await Lead.findByIdAndDelete(params.id)
  if (!lead) return errorResponse('Lead not found', 404)
  return successResponse({ message: 'Lead deleted' })
})
