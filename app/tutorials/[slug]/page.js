import connectDB from '@/lib/mongodb'
import Tutorial from '@/models/Tutorial'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Clock, BarChart2, ChevronRight, CheckCircle2, Code, BookOpen, ExternalLink, Layers, Tag, GraduationCap } from 'lucide-react'
import CodePlayground from '@/components/ui/CodePlayground'
import FixedPageLayout from '@/components/ui/FixedPageLayout'

export async function generateMetadata(props) {
  const params = await props.params
  await connectDB()
  const tutorial = await Tutorial.findOne({ slug: params.slug }).lean()
  if (!tutorial) return { title: 'Tutorial Not Found' }
  return {
    title: `${tutorial.title} | Harvegen`,
    description: tutorial.description,
    openGraph: { title: tutorial.title, description: tutorial.description },
  }
}

const CATEGORY_NAMES = {
  c: 'Embedded C',
  basics: 'MCU Basics',
  proto: 'Protocols',
  rtos: 'RTOS',
}

const DIFFICULTY_CONFIG = {
  Beginner:     { bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-300' },
  Intermediate: { bg: 'bg-amber-100',   text: 'text-amber-800',   border: 'border-amber-300'   },
  Advanced:     { bg: 'bg-red-100',     text: 'text-red-800',     border: 'border-red-300'     },
}

export default async function TutorialDetailPage(props) {
  const params = await props.params
  await connectDB()
  const tutorial = await Tutorial.findOne({ slug: params.slug }).lean()
  if (!tutorial) notFound()

  // Fetch all tutorials in the same category for the sidebar
  const relatedTutorials = await Tutorial.find({ category: tutorial.category })
    .select('title slug')
    .sort({ createdAt: 1 })
    .lean()

  const topics              = (tutorial.topics || []).filter(Boolean)
  const whatYoullLearn      = (tutorial.whatYoullLearn || []).filter(Boolean)
  const topicsCovered       = (tutorial.topicsCovered || []).filter(Boolean)
  const sections            = (tutorial.sections || []).filter(s => s.heading && s.description)
  const prerequisites       = (tutorial.prerequisites || []).filter(Boolean)
  const practiceExercises   = (tutorial.practiceExercises || []).filter(Boolean)
  const additionalResources = (tutorial.additionalResources || []).filter(r => r.label || r.url)
  const diff = DIFFICULTY_CONFIG[tutorial.difficulty] || DIFFICULTY_CONFIG.Beginner

  return (
    <FixedPageLayout>
      {/* ══════════════════════════════════════════════
          FIXED TWO-COLUMN LAYOUT
          Pinned to viewport below the navbar.
          Bypasses parent overflow-y-auto completely.
          Both panels scroll independently.
          ══════════════════════════════════════════════ */}
      <div
        className="bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 font-sans flex flex-row"
        style={{ position: 'fixed', top: '72px', left: 0, right: 0, bottom: 0, overflow: 'hidden', zIndex: 1 }}
      >
        {/* ─── LEFT SIDEBAR — independent scroll ── */}
        <aside
          className="hidden lg:flex flex-col w-72 flex-shrink-0 border-r border-slate-200 dark:border-slate-800 overflow-y-auto py-8 px-5"
          style={{ minHeight: 0 }}
        >
          <div className="flex items-center gap-2 mb-5">
            <div className="w-7 h-7 rounded-md bg-violet-100 flex items-center justify-center">
              <Layers className="w-4 h-4 text-violet-600" />
            </div>
            <span className="font-bold text-slate-700 text-sm">{CATEGORY_NAMES[tutorial.category]}</span>
          </div>

          <nav className="flex flex-col gap-1 border-l-2 border-slate-100 pl-3 ml-1">
            {relatedTutorials.map((rt) => {
              const isActive = rt.slug === tutorial.slug
              return (
                <Link
                  key={String(rt._id)}
                  href={`/tutorials/${rt.slug}`}
                  className={`relative py-2.5 px-3 rounded-r-lg text-sm transition-colors leading-snug ${
                    isActive
                      ? 'text-violet-700 font-semibold bg-violet-50/80'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  {isActive && (
                    <span className="absolute -left-[14px] top-0 bottom-0 w-0.5 bg-violet-600 rounded" />
                  )}
                  {rt.title}
                </Link>
              )
            })}
          </nav>
        </aside>

        {/* ─── RIGHT MAIN CONTENT — fills remaining width, independent scroll ── */}
        <main
          className="flex-1 min-w-0 overflow-y-auto pb-20 lg:pt-8 px-6 md:px-10"
          style={{ minHeight: 0 }}
        >
          
          {/* ══════════════════════════════════════════════
              PURPLE GRADIENT BANNER (Inside Main)
              Fixed: uses padding-based height, no max-h constraint
              ══════════════════════════════════════════════ */}
          <div className="-mx-6 md:-mx-10 bg-gradient-to-r from-violet-700 via-purple-700 to-indigo-700 lg:rounded-3xl shadow-lg overflow-hidden mb-10">
            <div className="px-6 md:px-10 py-8">
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-violet-200 text-sm mb-4 font-medium">
                <Link href="/tutorials" className="hover:text-white transition-colors">Tutorials</Link>
                <ChevronRight className="w-4 h-4 opacity-60" />
                <span className="text-white">{CATEGORY_NAMES[tutorial.category]}</span>
              </nav>

              <h1 className="text-2xl md:text-4xl font-extrabold text-white leading-tight tracking-tight mb-3 max-w-3xl">
                {tutorial.title}
              </h1>

              {tutorial.summary && (
                <p className="text-violet-100 text-base leading-relaxed max-w-2xl mb-4">{tutorial.summary}</p>
              )}

              {/* Meta chips */}
              <div className="flex flex-wrap gap-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${diff.bg} ${diff.text} ${diff.border}`}>
                  <BarChart2 className="w-3 h-3" /> {tutorial.difficulty}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-white border border-white/20">
                  <Clock className="w-3 h-3" /> {tutorial.time}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-white border border-white/20">
                  <Layers className="w-3 h-3" /> {CATEGORY_NAMES[tutorial.category]}
                </span>
              </div>
            </div>
          </div>



          {/* Mobile: in-category list */}
          <details className="lg:hidden mb-8 bg-slate-50 border border-slate-200 rounded-xl overflow-hidden group">
            <summary className="p-4 font-semibold text-slate-800 flex items-center justify-between cursor-pointer list-none">
              <span className="flex items-center gap-2"><Layers className="w-4 h-4 text-violet-500" /> In this category</span>
              <ChevronRight className="w-4 h-4 text-slate-400 group-open:rotate-90 transition-transform" />
            </summary>
            <nav className="p-4 pt-0 flex flex-col gap-2 border-t border-slate-200 mt-2">
              {relatedTutorials.map((rt) => (
                <Link key={String(rt._id)} href={`/tutorials/${rt.slug}`}
                  className={`text-sm transition-colors ${rt.slug === tutorial.slug ? 'text-violet-600 font-semibold' : 'text-slate-500 hover:text-slate-800'}`}>
                  {rt.title}
                </Link>
              ))}
            </nav>
          </details>

          {/* ── What You'll Learn ── */}
          {whatYoullLearn.length > 0 && (
            <div className="mb-8 p-6 bg-emerald-50 border border-emerald-200 rounded-2xl">
              <h2 className="font-bold text-emerald-900 mb-4 flex items-center gap-2 text-lg">
                <GraduationCap className="w-5 h-5 text-emerald-600" /> What You&apos;ll Learn
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {whatYoullLearn.map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-emerald-800 text-sm leading-snug">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Topics Covered ── */}
          {(topics.length > 0 || topicsCovered.length > 0) && (
            <div className="mb-8">
              <h2 className="font-bold text-slate-800 mb-3 flex items-center gap-2 text-sm uppercase tracking-wider">
                <Tag className="w-4 h-4 text-violet-500" /> Topics Covered
              </h2>
              <div className="flex flex-wrap gap-2">
                {[...topics, ...topicsCovered].map((topic, i) => (
                  <span key={i}
                    className="px-3 py-1 bg-violet-50 text-violet-700 border border-violet-200 rounded-full text-xs font-semibold tracking-wide">
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ── Content Sections ── */}
          {sections.length > 0 && (
            <div className="space-y-6 mb-12">
              {sections.map((sec, idx) => (
                <div key={idx}
                  className="border-l-4 border-blue-600 pl-5 py-1 bg-slate-50 rounded-r-xl pr-6">
                  <h2 className="text-lg font-bold text-slate-900 mb-2">{sec.heading}</h2>
                  <p className="text-slate-600 leading-relaxed text-[15px]">{sec.description}</p>
                </div>
              ))}
            </div>
          )}

          {/* ── Prerequisites — Blue ── */}
          {prerequisites.length > 0 && (
            <div className="mb-6 p-6 bg-sky-50 border border-sky-200 rounded-xl">
              <h3 className="font-bold text-sky-900 mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-sky-500" /> Prerequisites
              </h3>
              <ul className="space-y-2">
                {prerequisites.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sky-800 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-sky-500 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ── Practice Exercises — Yellow ── */}
          {practiceExercises.length > 0 && (
            <div className="mb-6 p-6 bg-yellow-50 border border-yellow-300 rounded-xl">
              <h3 className="font-bold text-yellow-900 mb-3 flex items-center gap-2">
                <Code className="w-5 h-5 text-yellow-600" /> Practice Exercises
              </h3>
              <ol className="space-y-2 list-decimal list-inside">
                {practiceExercises.map((item, i) => (
                  <li key={i} className="text-yellow-800 text-sm leading-relaxed">{item}</li>
                ))}
              </ol>
            </div>
          )}

          {/* ── Additional Resources — Purple ── */}
          {additionalResources.length > 0 && (
            <div className="mb-6 p-6 bg-purple-50 border border-purple-200 rounded-xl">
              <h3 className="font-bold text-purple-900 mb-3 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-500" /> Additional Resources
              </h3>
              <ul className="space-y-2">
                {additionalResources.map((res, i) => (
                  <li key={i}>
                    <a href={res.url} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-purple-700 hover:text-purple-900 text-sm font-medium hover:underline transition-colors">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400 flex-shrink-0" />
                      {res.label || res.url}
                      <ExternalLink className="w-3 h-3 opacity-60" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ── Interactive Code Lab ── */}
          {tutorial.codeSections && tutorial.codeSections.length > 0 && (
            <div className="mt-14 pt-10 border-t border-slate-200">
              <h2 className="text-2xl font-extrabold text-slate-900 mb-2 flex items-center gap-3">
                <Code className="w-7 h-7 text-violet-500" /> Interactive Code Lab
              </h2>
              <p className="text-slate-500 mb-8 text-sm max-w-2xl">
                Modify and run the examples below using a real C compiler inside your browser.
              </p>
              <div className="flex flex-col gap-10">
                {tutorial.codeSections.map((section, idx) => (
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
