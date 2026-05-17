import connectDB from '@/lib/mongodb'
import Tutorial from '@/models/Tutorial'
import Course from '@/models/Course'
import Article from '@/models/Article'
import { notFound } from 'next/navigation'
import TutorialReaderPage from '@/components/ui/TutorialReaderPage'

export async function generateMetadata(props) {
  const params = await props.params
  await connectDB()
  const tutorial = await Tutorial.findOne({ slug: params.slug }).lean()
  if (!tutorial) return { title: 'Module Not Found' }
  return {
    title: `${tutorial.title} | Harvegen`,
    description: tutorial.description || '',
  }
}

export default async function TutorialModulePage(props) {
  const params = await props.params
  await connectDB()

  // Current module with articles populated (need titles/slugs for sidebar)
  const currentModule = await Tutorial.findOne({ slug: params.slug })
    .populate('articles', 'title slug time difficulty description')
    .lean()

  if (!currentModule) notFound()

  // Course info
  const course = await Course.findOne({ slug: currentModule.course }).lean()

  // All modules in the same course for the sidebar
  const allModules = await Tutorial.find({ course: currentModule.course })
    .populate('articles', 'title slug time difficulty')
    .sort({ createdAt: 1 })
    .lean()

  // Fetch the first article's FULL content to display by default
  const firstArticleSlug = currentModule.articles?.[0]?.slug
  let initialArticle = null
  if (firstArticleSlug) {
    initialArticle = await Article.findOne({ slug: firstArticleSlug }).lean()
  }

  // Safely serialize mongoose objects for the client component
  const serialize = (obj) => JSON.parse(JSON.stringify(obj))

  return (
    <TutorialReaderPage
      course={course ? serialize(course) : null}
      allModules={serialize(allModules)}
      currentModuleSlug={params.slug}
      initialArticle={initialArticle ? serialize(initialArticle) : null}
    />
  )
}
