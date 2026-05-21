'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Button } from './ui/button'
import { TutorialCardSkeleton } from './ui/skeletons'

/* ─── Helper: sum all article read-times ─────────────────────── */
function calcTotalTime(articles) {
  if (!articles?.length) return null
  let totalMins = 0
  for (const art of articles) {
    if (!art.time) continue
    const lower = art.time.toLowerCase()
    const nums = art.time.match(/\d+/g)
    if (!nums) continue
    if (lower.includes('h')) {
      totalMins += parseInt(nums[0]) * 60 + (nums[1] ? parseInt(nums[1]) : 0)
    } else {
      totalMins += parseInt(nums[0])
    }
  }
  if (!totalMins) return null
  if (totalMins < 60) return `${totalMins} min`
  const h = Math.floor(totalMins / 60)
  const m = totalMins % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

/* ── Dynamic subtitle: "Embedded C, RTOS and AVR Microcontrollers" ── */
function buildSubtitle(courses) {
  if (!courses || courses.length === 0) return 'Practical embedded systems content for every skill level.'
  const names = courses.map(c => c.name)
  if (names.length === 1) return `Explore ${names[0]} — from beginner to advanced.`
  const last = names[names.length - 1]
  const rest = names.slice(0, -1).join(', ')
  return `Covers ${rest} and ${last} — from beginner to advanced.`
}

function Tutorials() {
  const [activeTab, setActiveTab] = useState('')
  const [courses, setCourses] = useState([])
  const [tutorials, setTutorials] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const limit = 9

  useEffect(() => {
    fetch('/api/courses')
      .then(r => r.json())
      .then(json => {
        if (json.success && json.data.length > 0) {
          setCourses(json.data)
          if (!activeTab) setActiveTab(json.data[0].slug)
        }
      })
      .catch(console.error)
  }, [])

  const fetchTutorials = useCallback(async () => {
    if (!activeTab) return
    setLoading(true)
    setError(null)
    try {
      // newest first
      const params = new URLSearchParams({ course: activeTab, page, limit, sort: 'newest' })
      const res = await fetch(`/api/tutorials?${params}`)
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      setTutorials(json.data.tutorials || [])
      setTotal(json.data.total || 0)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [activeTab, page])

  useEffect(() => { if (activeTab) fetchTutorials() }, [fetchTutorials, activeTab])

  const totalPages = Math.ceil(total / limit)
  const subtitle = buildSubtitle(courses)

  return (
    <>
      {/* ── Hero Header ── */}
      <header className="pt-[100px] sm:pt-[120px] pb-10 sm:pb-16 relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-primary-50/30">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 via-primary-500/10 to-transparent blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-8 w-full relative z-10">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-sm text-gray-400 mb-6 font-mono">
            <Link href="/" className="hover:text-primary-600 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-primary-600 font-medium">Tutorials</span>
          </nav>

          {/* Heading row — side-by-side on lg+, stacked on mobile */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase text-primary-600 mb-3">
                <span className="w-6 h-px bg-primary-600 inline-block" />
                Learning Modules
              </p>
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight tracking-tight">
                Embedded Systems<br />
                <span className="text-primary-600">Tutorials</span>
              </h1>
              <p className="mt-4 text-gray-500 text-base sm:text-lg max-w-xl leading-relaxed">
                {subtitle}
              </p>
            </div>

            {/* Stats pills — row on mobile too, just smaller */}
            <div className="flex gap-3 flex-wrap lg:flex-nowrap shrink-0">
              <div className="bg-white border border-gray-200 rounded-2xl px-4 sm:px-5 py-3 text-center shadow-sm min-w-[80px]">
                <p className="text-xl sm:text-2xl font-bold text-primary-600">{courses.length}</p>
                <p className="text-xs text-gray-500 mt-0.5">Courses</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl px-4 sm:px-5 py-3 text-center shadow-sm min-w-[80px]">
                <p className="text-xl sm:text-2xl font-bold text-primary-600">{total || '—'}</p>
                <p className="text-xs text-gray-500 mt-0.5">Modules</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="py-10 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">

          {/* Course tab filter */}
          {courses.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8 sm:mb-10 pb-6 border-b border-gray-100">
              {courses.map(course => (
                <button
                  key={course.slug}
                  onClick={() => { setActiveTab(course.slug); setPage(1) }}
                  className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 ${
                    activeTab === course.slug
                      ? 'bg-primary-600 text-white border-primary-600 shadow-md'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-primary-400 hover:text-primary-600'
                  }`}
                >
                  {course.name}
                </button>
              ))}
            </div>
          )}

          {error && (
            <div className="text-center py-20">
              <p className="text-red-500 mb-4">{error}</p>
              <Button onClick={fetchTutorials} variant="outline">Try Again</Button>
            </div>
          )}

          {/* Module cards grid — 3 col desktop, 2 tablet, 1 mobile */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {loading
              ? Array(6).fill(0).map((_, i) => <TutorialCardSkeleton key={i} />)
              : tutorials.length === 0
              ? (
                <div className="col-span-3 text-center py-24">
                  <p className="text-gray-400 text-lg mb-2">No modules in this course yet</p>
                  <p className="text-gray-500 text-sm">Content is being added. Check back soon!</p>
                </div>
              )
              : tutorials.map((tut) => (
                <Link
                  href={`/tutorials/${tut.slug}`}
                  key={tut._id}
                  className="group bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-primary-400 hover:-translate-y-1 transition-all duration-300 flex flex-col"
                >
                  {/* Card image */}
                  {tut.imageURL && (
                    <div className="h-[180px] overflow-hidden relative shrink-0">
                      <img
                        src={tut.imageURL}
                        alt={tut.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  )}

                  {/* Card body */}
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2 leading-snug">
                      {tut.title}
                    </h3>
                    <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed flex-1">
                      {tut.description || 'No description provided.'}
                    </p>

                    {/* Footer row: total time (left) | article count badge (right) */}
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                      {/* Time — plain muted text with clock icon */}
                      <span className="flex items-center gap-1.5 text-xs text-gray-400">
                        <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                        </svg>
                        {calcTotalTime(tut.articles) ?? '0 min'}
                      </span>

                      {/* Articles count — styled badge like difficulty pill */}
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide border text-violet-700 border-violet-200 bg-violet-50">
                        <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                          <path strokeLinecap="round" d="M4 6h16M4 10h16M4 14h10"/>
                        </svg>
                        {tut.articles?.length || 0} {tut.articles?.length === 1 ? 'Article' : 'Articles'}
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            }
          </div>

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-12">
              <Button disabled={page === 1} onClick={() => setPage(p => p - 1)} variant="outline">← Previous</Button>
              <span className="text-gray-500 text-sm">Page {page} of {totalPages}</span>
              <Button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} variant="outline">Next →</Button>
            </div>
          )}
        </div>
      </main>

      {/* ── CTA Banner ── */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-primary-600 to-primary-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 sm:p-12 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent rounded-3xl" />
            <div className="relative z-10">
              <h2 className="text-white mb-4 text-3xl sm:text-4xl font-bold">
                Learn by <span className="text-yellow-300">Building</span>
              </h2>
              <p className="text-white/80 mx-auto mb-8 max-w-[560px] text-base sm:text-lg leading-relaxed">
                Each tutorial is linked to a real project. Grab the code, fire up your hardware, and start building.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Link
                  href="/projects"
                  className="px-6 py-3 bg-white text-primary-600 font-semibold rounded-full hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all"
                >
                  Browse Projects
                </Link>
                <Link
                  href="/resources"
                  className="px-6 py-3 bg-white/10 text-white border border-white/30 font-semibold rounded-full hover:bg-white/20 transition-all"
                >
                  Get Source Code
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Tutorials