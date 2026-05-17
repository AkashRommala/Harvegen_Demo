import connectDB from '@/lib/mongodb'
import Article from '@/models/Article'
import Course from '@/models/Course'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Clock, BarChart2, ChevronRight, CheckCircle2, Code, BookOpen, ExternalLink, Layers, Tag, GraduationCap, Zap } from 'lucide-react'
import CodePlayground from '@/components/ui/CodePlayground'
import FixedPageLayout from '@/components/ui/FixedPageLayout'

export async function generateMetadata(props) {
  const params = await props.params
  await connectDB()
  const article = await Article.findOne({ slug: params.slug }).lean()
  if (!article) return { title: 'Article Not Found' }
  return {
    title: `${article.title} | Harvegen`,
    description: article.description,
    openGraph: { title: article.title, description: article.description },
  }
}

const DIFFICULTY_CONFIG = {
  Beginner:     { bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-300' },
  Intermediate: { bg: 'bg-amber-100',   text: 'text-amber-800',   border: 'border-amber-300'   },
  Advanced:     { bg: 'bg-red-100',     text: 'text-red-800',     border: 'border-red-300'     },
}

export default async function ArticleDetailPage(props) {
  const params = await props.params
  await connectDB()
  const article = await Article.findOne({ slug: params.slug }).lean()
  if (!article) notFound()

  const courseDoc = await Course.findOne({ slug: article.category }).lean()
  const courseName = courseDoc ? courseDoc.name : article.category

  const relatedArticles = await Article.find({ category: article.category })
    .select('title slug')
    .sort({ createdAt: -1 })
    .limit(10)
    .lean()

  const config = DIFFICULTY_CONFIG[article.difficulty] || DIFFICULTY_CONFIG.Beginner

  return (
    <FixedPageLayout>
      <div
        className="bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 font-sans flex flex-row"
        style={{ position: 'fixed', top: '72px', left: 0, right: 0, bottom: 0, overflow: 'hidden', zIndex: 1 }}
      >
        <aside
          className="hidden lg:flex flex-col w-72 flex-shrink-0 border-r border-slate-200 dark:border-slate-800 overflow-y-auto py-8 px-5"
          style={{ minHeight: 0 }}
        >
          <div className="flex items-center gap-2 mb-5">
            <div className="w-7 h-7 rounded-md bg-violet-100 flex items-center justify-center">
              <Layers className="w-4 h-4 text-violet-600" />
            </div>
            <span className="font-bold text-slate-700 text-sm">{courseName}</span>
          </div>

          <nav className="flex flex-col gap-1 border-l-2 border-slate-100 pl-3 ml-1">
            {relatedArticles.map((rel) => {
              const isActive = rel.slug === article.slug
              return (
                <Link
                  key={String(rel._id)}
                  href={`/articles/${rel.slug}`}
                  className={`relative py-2.5 px-3 rounded-r-lg text-sm transition-colors leading-snug ${
                    isActive
                      ? 'text-violet-700 font-semibold bg-violet-50/80'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  {isActive && (
                    <span className="absolute -left-[14px] top-0 bottom-0 w-0.5 bg-violet-600 rounded" />
                  )}
                  {rel.title}
                </Link>
              )
            })}
          </nav>
        </aside>

        <main
          className="flex-1 min-w-0 overflow-y-auto pb-20 lg:pt-8 px-6 md:px-10"
          style={{ minHeight: 0 }}
        >
          <div className="-mx-6 md:-mx-10 bg-gradient-to-r from-violet-700 via-purple-700 to-indigo-700 lg:rounded-3xl shadow-lg overflow-hidden mb-10">
            <div className="px-6 md:px-10 py-8">
              <nav className="flex items-center gap-2 text-violet-200 text-sm mb-4 font-medium">
                <Link href="/courses" className="hover:text-white transition-colors">Courses</Link>
                <ChevronRight className="w-4 h-4 opacity-60" />
                <span className="text-white">{courseName}</span>
              </nav>

              <h1 className="text-2xl md:text-4xl font-extrabold text-white leading-tight tracking-tight mb-3 max-w-3xl">
                {article.title}
              </h1>

              {article.description && (
                <p className="text-violet-100/80 text-sm md:text-base font-medium max-w-2xl leading-relaxed mb-6">
                  {article.description}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-3">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${config.bg} ${config.text} ${config.border} border`}>
                  <Zap className="w-3 h-3" /> {article.difficulty || 'Intermediate'}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-white border border-white/20">
                  <Clock className="w-3 h-3" /> {article.time || '15 min'}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-white border border-white/20">
                  <Layers className="w-3 h-3" /> {courseName}
                </span>
              </div>
            </div>
          </div>

          <details className="lg:hidden mb-8 bg-slate-50 border border-slate-200 rounded-xl overflow-hidden group">
            <summary className="p-4 font-semibold text-slate-800 flex items-center justify-between cursor-pointer list-none">
              <span className="flex items-center gap-2"><Layers className="w-4 h-4 text-violet-500" /> In this course</span>
              <ChevronRight className="w-4 h-4 text-slate-400 group-open:rotate-90 transition-transform" />
            </summary>
            <nav className="p-4 pt-0 flex flex-col gap-2 border-t border-slate-200 mt-2">
              {relatedArticles.map((rel) => (
                <Link key={String(rel._id)} href={`/articles/${rel.slug}`}
                  className={`text-sm py-1.5 transition-colors ${rel.slug === article.slug ? 'font-bold text-violet-600' : 'text-slate-500 hover:text-slate-900'}`}>
                  {rel.title}
                </Link>
              ))}
            </nav>
          </details>

          {article.whatYoullLearn?.length > 0 && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 mb-12">
              <h3 className="text-emerald-900 font-bold text-lg mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                What You'll Learn
              </h3>
              <ul className="grid sm:grid-cols-2 gap-3">
                {article.whatYoullLearn.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-emerald-800">
                    <span className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {article.topicsCovered?.length > 0 && (
            <div className="mt-12 pt-8 border-t border-slate-200">
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Topics Covered</h4>
              <div className="flex flex-wrap gap-2">
                {article.topicsCovered.map((topic, i) => (
                  <span key={i} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-semibold border border-slate-200">
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          )}

          {article.sections?.length > 0 && (
            <div className="space-y-6 mb-12">
              {article.sections.map((sec, idx) => (
                <div key={idx}
                  className="border-l-4 border-blue-600 pl-5 py-1 bg-slate-50 rounded-r-xl pr-6">
                  <h2 className="text-lg font-bold text-slate-900 mb-2">{sec.heading}</h2>
                  <p className="text-slate-600 leading-relaxed text-[15px]">{sec.description}</p>
                </div>
              ))}
            </div>
          )}

          {article.codeSections?.length > 0 && (
            <div className="mt-14 pt-10 border-t border-slate-200">
              <h2 className="text-2xl font-extrabold text-slate-900 mb-2 flex items-center gap-3">
                <Code className="w-7 h-7 text-violet-500" /> Interactive Code Lab
              </h2>
              <p className="text-slate-500 mb-8 text-sm max-w-2xl">
                Modify and run the examples below using a real C compiler inside your browser.
              </p>
              <div className="flex flex-col gap-10">
                {article.codeSections.map((section, idx) => (
                  <CodePlayground key={idx} title={section.title} language={section.language} initialCode={section.initialCode} />
                ))}
              </div>
            </div>
          )}

          {/* ── Bottom Nav ── */}
          <div className="mt-16 pt-8 border-t border-slate-200">
            <Link href="/tutorials"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 text-sm font-medium hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
              <ChevronRight className="w-4 h-4 rotate-180" /> Back to All Tutorials
            </Link>
          </div>
        </main>
      </div>
    </FixedPageLayout>
  )
}
