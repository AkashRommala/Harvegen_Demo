import { uploadToCloudinary } from '@/lib/cloudinary'
import { successResponse, errorResponse, requireAdmin, withErrorHandler } from '@/lib/apiHelpers'

export const POST = withErrorHandler(async (request) => {
  const guard = await requireAdmin(request)
  if (guard) return guard

  const formData = await request.formData()
  const file = formData.get('file')
  const folder = formData.get('folder') || 'harvegen'

  if (!file || typeof file === 'string') {
    return errorResponse('No file uploaded', 400)
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const url = await uploadToCloudinary(buffer, folder)

  return successResponse({ url }, 201)
})

// Next.js App Router handles multipart/form-data natively via request.formData()
