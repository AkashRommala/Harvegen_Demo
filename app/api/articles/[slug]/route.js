import connectDB from '@/lib/mongodb'
import Article from '@/models/Article'
import { ArticleUpdateSchema } from '@/lib/validations'
import { successResponse, errorResponse, requireAdmin, withErrorHandler } from '@/lib/apiHelpers'

export const GET = withErrorHandler(async (_, props) => {
  const params = await props.params;
  await connectDB()
  const article = await Article.findOne({ slug: params.slug }).lean()
  if (!article) return errorResponse('Article not found', 404)
  return successResponse(article)
})

export const PUT = withErrorHandler(async (request, props) => {
  const params = await props.params;
  const guard = await requireAdmin(request)
  if (guard) return guard

  await connectDB()
  const body = await request.json()
  const parsed = ArticleUpdateSchema.safeParse(body)
  if (!parsed.success) {
    return errorResponse('Validation failed', 422, parsed.error.flatten().fieldErrors)
  }

  const article = await Article.findOneAndUpdate({ slug: params.slug }, parsed.data, {
    new: true,
    runValidators: true,
  })
  if (!article) return errorResponse('Article not found', 404)
  return successResponse(article)
})

export const DELETE = withErrorHandler(async (request, props) => {
  const params = await props.params;
  const guard = await requireAdmin(request)
  if (guard) return guard

  await connectDB()
  const article = await Article.findOneAndDelete({ slug: params.slug })
  if (!article) return errorResponse('Article not found', 404)
  return successResponse({ message: 'Article deleted successfully' })
})
