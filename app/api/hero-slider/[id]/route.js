import connectDB from '@/lib/mongodb'
import HeroSlider from '@/models/HeroSlider'
import { HeroSliderUpdateSchema } from '@/lib/validations'
import { successResponse, errorResponse, requireAdmin, withErrorHandler } from '@/lib/apiHelpers'

export const PUT = withErrorHandler(async (request, props) => {
  const params = await props.params;
  const guard = requireAdmin(request)
  if (guard) return guard

  await connectDB()
  const body = await request.json()
  const parsed = HeroSliderUpdateSchema.safeParse(body)
  if (!parsed.success) {
    return errorResponse('Validation failed', 422, parsed.error.flatten().fieldErrors)
  }

  const slide = await HeroSlider.findByIdAndUpdate(params.id, parsed.data, {
    new: true,
    runValidators: true,
  })
  if (!slide) return errorResponse('Slide not found', 404)
  return successResponse(slide)
})

export const DELETE = withErrorHandler(async (request, props) => {
  const params = await props.params;
  const guard = requireAdmin(request)
  if (guard) return guard

  await connectDB()
  const slide = await HeroSlider.findByIdAndDelete(params.id)
  if (!slide) return errorResponse('Slide not found', 404)
  return successResponse({ message: 'Slide deleted' })
})
