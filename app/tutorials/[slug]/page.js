import connectDB from '@/lib/mongodb'
import Tutorial from '@/models/Tutorial'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Clock, BarChart2, ChevronRight, CheckCircle2, Code, BookOpen, ExternalLink, Layers } from 'lucide-react'
import CodePlayground from '@/components/ui/CodePlayground'

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

  const topics           = (tutorial.topics || []).filter(Boolean)
  const sections         = (tutorial.sections || []).filter(s => s.heading && s.description)
  const prerequisites    = (tutorial.prerequisites || []).filter(Boolean)
  const practiceExercises = (tutorial.practiceExercises || []).filter(Boolean)
  const additionalResources = (tutorial.additionalResources || []).filter(r => r.label || r.url)
  const diff = DIFFICULTY_CONFIG[tutorial.difficulty] || DIFFICULTY_CONFIG.Beginner

  return (
    // Force light theme — no dark: classes anywhere in this page
    <div className="min-h-screen bg-white text-slate-800 font-sans">

      {/* ══════════════════════════════════════════════
          PURPLE GRADIENT BANNER
          ══════════════════════════════════════════════ */}
      <div className="bg-gradient-to-r from-violet-700 via-purple-700 to-indigo-700 pt-[72px]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-10 md:py-14">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-violet-200 text-sm mb-6 font-medium">
            <Link href="/tutorials" className="hover:text-white transition-colors">Tutorials</Link>
            <ChevronRight className="w-4 h-4 opacity-60" />
            <span className="text-white">{CATEGORY_NAMES[tutorial.category]}</span>
          </nav>

          <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight tracking-tight mb-4 max-w-4xl">
            {tutorial.title}
          </h1>

          {tutorial.summary && (
            <p className="text-violet-100 text-lg leading-relaxed max-w-3xl mb-6">{tutorial.summary}</p>
          )}

          {/* Meta chips */}
          <div className="flex flex-wrap gap-3">
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

      {/* ══════════════════════════════════════════════
          TWO-COLUMN LAYOUT: Sidebar + Main
          ══════════════════════════════════════════════ */}
      <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row">

        {/* ─── LEFT SIDEBAR ─────────────────────────────── */}
        <aside className="hidden lg:block w-64 xl:w-72 flex-shrink-0 border-r border-slate-200">
          <div className="sticky top-[72px] h-[calc(100vh-72px)] overflow-y-auto py-8 px-5">
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
                    className={`relative py-2 px-3 rounded-r-lg text-sm transition-colors leading-snug ${
                      isActive
                        ? 'text-violet-700 font-semibold bg-violet-50'
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
          </div>
        </aside>

        {/* ─── MAIN CONTENT ─────────────────────────────── */}
        <main className="flex-1 min-w-0 px-6 md:px-12 lg:px-16 py-10 lg:py-14">

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

          {/* ── Topic Pills ── */}
          {topics.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-10">
              {topics.map((topic, i) => (
                <span key={i}
                  className="px-3 py-1 bg-violet-50 text-violet-700 border border-violet-200 rounded-full text-xs font-semibold tracking-wide">
                  {topic}
                </span>
              ))}
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
    </div>
  )
}
