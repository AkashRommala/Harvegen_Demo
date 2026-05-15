import connectDB from '@/lib/mongodb'
import Lead from '@/models/Lead'
import { LeadSchema } from '@/lib/validations'
import { successResponse, errorResponse, requireAdmin, withErrorHandler } from '@/lib/apiHelpers'
import { sendContactEmail } from '@/lib/email'

// POST /api/contact — public route (anyone can submit)
export const POST = withErrorHandler(async (request) => {
  await connectDB()
  const body = await request.json()
  const parsed = LeadSchema.safeParse(body)
  if (!parsed.success) {
    return errorResponse('Validation failed', 422, parsed.error.flatten().fieldErrors)
  }

  const lead = await Lead.create(parsed.data)

  // Send notification email (non-blocking — don't fail if email fails)
  try {
    await sendContactEmail(parsed.data)
  } catch (emailErr) {
    console.error('[Email Error]', emailErr.message)
  }

  return successResponse({ message: 'Message received. We will get back to you soon!' }, 201)
})

// GET /api/contact — admin only, list all leads
export const GET = withErrorHandler(async (request) => {
  const guard = requireAdmin(request)
  if (guard) return guard

  await connectDB()
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = Math.min(parseInt(searchParams.get('limit') || '50', 10), 200)

  const filter = {}
  if (status) filter.status = status

  const [leads, total] = await Promise.all([
    Lead.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    Lead.countDocuments(filter),
  ])

  return successResponse({ leads, total, page, limit })
})