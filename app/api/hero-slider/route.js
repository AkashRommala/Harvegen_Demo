import connectDB from '@/lib/mongodb'
import HeroSlider from '@/models/HeroSlider'
import { HeroSliderSchema } from '@/lib/validations'
import { successResponse, errorResponse, requireAdmin, withErrorHandler } from '@/lib/apiHelpers'

// GET /api/hero-slider — active slides sorted by orderIndex
export const GET = withErrorHandler(async () => {
  await connectDB()
  const slides = await HeroSlider.find({ isActive: true }).sort({ orderIndex: 1 }).lean()
  return successResponse(slides)
})

export const POST = withErrorHandler(async (request) => {
  const guard = await requireAdmin(request)
  if (guard) return guard

  await connectDB()
  const body = await request.json()
  const parsed = HeroSliderSchema.safeParse(body)
  if (!parsed.success) {
    return errorResponse('Validation failed', 422, parsed.error.flatten().fieldErrors)
  }

  const slide = await HeroSlider.create(parsed.data)
  return successResponse(slide, 201)
})
