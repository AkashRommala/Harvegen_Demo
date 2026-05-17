'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import {
  ChevronDown, ArrowLeft, Clock, Zap, BookOpen,
  CheckCircle2, ExternalLink, Layers, ChevronRight, Menu, X,
} from 'lucide-react'

const CodePlayground = dynamic(() => import('./CodePlayground'), { ssr: false })

const DIFF = {
  Beginner:     { bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-200' },
  Intermediate: { bg: 'bg-amber-100',   text: 'text-amber-800',   border: 'border-amber-200'   },
  Advanced:     { bg: 'bg-red-100',     text: 'text-red-800',     border: 'border-red-200'     },
}

/* ─── Article content renderer ─────────────────────────────────────────────── */
function ArticleContent({ article }) {
  if (!article) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-400 gap-3">
      <BookOpen className="w-12 h-12 opacity-30" />
      <p className="text-lg font-medium">Select an article to start reading</p>
    </div>
  )

  const cfg = DIFF[article.difficulty] || DIFF.Beginner

  return (
    <div className="pb-24 w-full">
      {/* Hero Banner — rounded, detached from navbar */}
      <div className="bg-gradient-to-r from-violet-700 via-purple-700 to-indigo-700 mx-4 sm:mx-8 mt-6 sm:mt-8 rounded-2xl sm:rounded-3xl px-5 sm:px-8 md:px-12 py-8 sm:py-10 w-auto">
        <h1 className="text-xl sm:text-2xl md:text-4xl font-extrabold text-white leading-tight mb-4">
          {article.title}
        </h1>
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
            <Zap className="w-3 h-3" /> {article.difficulty || 'Intermediate'}
          </span>
          {article.time && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-white border border-white/20">
              <Clock className="w-3 h-3" /> {article.time}
            </span>
          )}
        </div>
        {article.description && (
          <p className="text-violet-100/80 text-sm md:text-base max-w-3xl leading-relaxed">{article.description}</p>
        )}
      </div>

      {/* Body — full width with controlled padding */}
      <div className="px-4 sm:px-8 md:px-12 mt-8 w-full space-y-8">

        {/* What You'll Learn */}
        {article.whatYoullLearn?.filter(Boolean).length > 0 && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 sm:p-6">
            <h3 className="text-emerald-900 font-bold text-base mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" /> What You&apos;ll Learn
            </h3>
            <ul className="grid sm:grid-cols-2 gap-2.5">
              {article.whatYoullLearn.filter(Boolean).map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-emerald-800">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Topics Covered */}
        {article.topicsCovered?.filter(Boolean).length > 0 && (
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Topics Covered</h4>
            <div className="flex flex-wrap gap-2">
              {article.topicsCovered.filter(Boolean).map((t, i) => (
                <span key={i} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-semibold border border-slate-200">{t}</span>
              ))}
            </div>
          </div>
        )}

        {/* Content Sections — right after Topics Covered */}
        {article.sections?.filter(s => s.heading).length > 0 && (
          <div className="space-y-5">
            {article.sections.filter(s => s.heading).map((sec, i) => (
              <div key={i} className="border-l-4 border-blue-500 pl-5 py-1 bg-slate-50 rounded-r-xl pr-4 sm:pr-6">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-2">{sec.heading}</h2>
                <p className="text-slate-600 leading-relaxed text-sm sm:text-[15px] whitespace-pre-line">{sec.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Code Playgrounds — after Content Sections */}
        {article.codeSections?.length > 0 && (
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 mb-2">Interactive Code Lab</h2>
            <p className="text-slate-500 text-sm mb-6">Modify and run the examples below in your browser.</p>
            <div className="space-y-8">
              {article.codeSections.map((cs, i) => (
                <CodePlayground key={i} title={cs.title} language={cs.language} initialCode={cs.initialCode} />
              ))}
            </div>
          </div>
        )}

        {/* Practice Exercises */}
        {article.practiceExercises?.filter(Boolean).length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
            <h4 className="text-amber-800 font-bold text-sm mb-3">Practice Exercises</h4>
            <ol className="space-y-2">
              {article.practiceExercises.filter(Boolean).map((ex, i) => (
                <li key={i} className="text-sm text-amber-700 flex items-start gap-2">
                  <span className="font-bold shrink-0">{i + 1}.</span> {ex}
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Prerequisites */}
        {article.prerequisites?.filter(Boolean).length > 0 && (
          <div className="bg-sky-50 border border-sky-200 rounded-xl p-5">
            <h4 className="text-sky-800 font-bold text-sm mb-3">Prerequisites</h4>
            <ul className="space-y-1">
              {article.prerequisites.filter(Boolean).map((p, i) => (
                <li key={i} className="text-sm text-sky-700 flex items-start gap-2">
                  <ChevronRight className="w-3.5 h-3.5 mt-0.5 shrink-0" /> {p}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Additional Resources */}
        {article.additionalResources?.filter(r => r.label || r.url).length > 0 && (
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-5">
            <h4 className="text-purple-800 font-bold text-sm mb-3">Additional Resources</h4>
            <ul className="space-y-2">
              {article.additionalResources.filter(r => r.label || r.url).map((r, i) => (
                <li key={i}>
                  <a href={r.url} target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-purple-700 hover:text-purple-900 hover:underline break-all">
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" /> {r.label || r.url}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── Main GFG Reader Component ────────────────────────────────────────────── */
export default function TutorialReaderPage({ course, allModules, currentModuleSlug, initialArticle }) {
  const [expandedModules, setExpandedModules] = useState({ [currentModuleSlug]: true })
  const [activeArticle, setActiveArticle] = useState(initialArticle)
  const [activeArticleSlug, setActiveArticleSlug] = useState(initialArticle?.slug || '')
  const [loadingArticle, setLoadingArticle] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const loadArticle = useCallback(async (slug) => {
    if (slug === activeArticleSlug) { setSidebarOpen(false); return }
    setLoadingArticle(true)
    setSidebarOpen(false)
    try {
      const res = await fetch(`/api/articles/${slug}`)
      const json = await res.json()
      if (json.success) {
        setActiveArticle(json.data)
        setActiveArticleSlug(slug)
        document.getElementById('reader-content')?.scrollTo({ top: 0, behavior: 'smooth' })
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoadingArticle(false)
    }
  }, [activeArticleSlug])

  const toggleModule = (slug) => setExpandedModules(p => ({ ...p, [slug]: !p[slug] }))

  /* ── Sidebar content ── */
  const SidebarContent = () => (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Sidebar header */}
      <div className="px-4 py-4 border-b border-gray-200 shrink-0 bg-white">
        <Link
          href="/tutorials"
          className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-primary-600 font-medium mb-3 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Courses
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-primary-100 flex items-center justify-center shrink-0">
            <Layers className="w-4 h-4 text-primary-600" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Course</p>
            <h2 className="font-bold text-gray-900 text-sm leading-tight truncate">{course?.name || 'Modules'}</h2>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-1.5">{allModules.length} module{allModules.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Accordion list */}
      <div className="flex-1 overflow-y-auto overscroll-contain">
        {allModules.map((mod, idx) => {
          const isCurrentMod = mod.slug === currentModuleSlug
          const isExpanded = !!expandedModules[mod.slug]
          const articles = mod.articles || []

          return (
            <div key={mod._id || idx} className={`border-b border-gray-100 ${isCurrentMod ? 'bg-primary-50/40' : ''}`}>
              <button
                onClick={() => toggleModule(mod.slug)}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-gray-50 transition-colors group"
              >
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                  isCurrentMod ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600 group-hover:bg-primary-100 group-hover:text-primary-700'
                }`}>
                  {idx + 1}
                </span>
                <span className={`flex-1 text-sm font-semibold leading-snug text-left ${isCurrentMod ? 'text-primary-700' : 'text-gray-700'}`}>
                  {mod.title}
                </span>
                <ChevronDown className={`w-4 h-4 shrink-0 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
              </button>

              {isExpanded && (
                <div className="bg-gray-50/80 border-t border-gray-100">
                  {articles.length === 0 ? (
                    <p className="px-10 py-3 text-xs text-gray-400 italic">No articles yet</p>
                  ) : (
                    articles.map((art, artIdx) => {
                      const isActive = art.slug === activeArticleSlug
                      return (
                        <button
                          key={art._id || artIdx}
                          onClick={() => loadArticle(art.slug)}
                          className={`w-full flex items-center gap-2 px-5 py-2.5 text-left text-sm transition-colors border-l-2 ${
                            isActive
                              ? 'border-primary-500 bg-primary-50 text-primary-700 font-semibold'
                              : 'border-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isActive ? 'bg-primary-500' : 'bg-gray-300'}`} />
                          <span className="leading-snug line-clamp-2 text-left">{art.title}</span>
                        </button>
                      )
                    })
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Page wrapper — sits below the fixed 72px navbar */}
      <div
        className="flex w-full overflow-hidden"
        style={{ height: 'calc(100vh - 72px)', marginTop: '72px' }}
      >
        {/* ── Sidebar — sticky on desktop, fixed overlay on mobile ── */}
        <aside
          className={`
            fixed lg:sticky top-[72px] left-0 z-50 lg:z-auto
            w-[280px] sm:w-[300px] flex-shrink-0
            bg-white border-r border-gray-200
            flex flex-col
            transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
          style={{ height: 'calc(100vh - 72px)' }}
        >
          {/* Mobile close button inside sidebar */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden absolute top-3 right-3 p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 z-10"
          >
            <X className="w-4 h-4" />
          </button>
          <SidebarContent />
        </aside>

        {/* ── Main Content ── */}
        <main
          id="reader-content"
          className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden bg-white"
        >
          {/* Mobile: Modules toggle bar at top */}
          <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-2.5 flex items-center gap-3 shadow-sm">
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-primary-50 text-primary-700 border border-primary-200 rounded-lg text-sm font-semibold hover:bg-primary-100 transition-colors"
            >
              <Menu className="w-4 h-4" />
              Modules
            </button>
            {activeArticle && (
              <span className="text-sm text-gray-600 truncate font-medium">{activeArticle.title}</span>
            )}
          </div>

          {loadingArticle ? (
            <div className="flex items-center justify-center h-48 mt-12">
              <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <ArticleContent article={activeArticle} />
          )}
        </main>
      </div>
    </>
  )
}
