'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Button } from './ui/button'
import { TutorialCardSkeleton } from './ui/skeletons'

const DIFFICULTY_COLORS = {
  Beginner: 'text-emerald-700 border-emerald-200 bg-emerald-50',
  Intermediate: 'text-amber-700 border-amber-200 bg-amber-50',
  Advanced: 'text-red-700 border-red-200 bg-red-50',
}

function Tutorials() {
  const [activeTab, setActiveTab] = useState('')
  const [categories, setCategories] = useState([])
  const [tutorials, setTutorials] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const limit = 9

  // Fetch Categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories')
        const json = await res.json()
        if (json.success && json.data.length > 0) {
          setCategories(json.data)
          // Set first category as active by default if none selected
          if (!activeTab) setActiveTab(json.data[0].slug)
        }
      } catch (err) {
        console.error('Failed to load categories', err)
      }
    }
    fetchCategories()
  }, []) // activeTab is intentionally omitted here to only run on mount

  const fetchTutorials = useCallback(async () => {
    if (!activeTab) return // Don't fetch until we have an active category
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({ category: activeTab, page, limit })
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

  useEffect(() => {
    if (activeTab) {
      fetchTutorials()
    }
  }, [fetchTutorials, activeTab])

  const handleTabChange = (slug) => {
    setActiveTab(slug)
    setPage(1)
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <>
      {/* Page Hero */}
      <header className="pt-[120px] pb-20 relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-primary-50/30">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/3 via-primary-500/8 to-transparent rounded-full blur-3xl animate-gradient" />
        <div className="max-w-[1400px] mx-auto px-8 w-full relative z-10">
          <div className="text-sm text-gray-500 mb-6 font-mono animate-fade-in">
            <Link href="/" className="text-gray-400 hover:text-primary-600 transition-colors">Home</Link>
            <span className="text-gray-400"> / </span>
            <span className="text-primary-600">Tutorials</span>
          </div>
          <div className="space-y-6 animate-slide-up">
            <div className="inline-flex items-center gap-3 mb-4 font-semibold text-sm tracking-widest uppercase text-primary-600">
              <span className="w-8 h-px bg-primary-600" />
              Learning Resources
            </div>
            <h1 className="text-gray-900 font-display text-5xl md:text-6xl font-bold leading-tight">
              Embedded Systems<br /><span className="text-primary-600">Tutorials</span>
            </h1>
            <p className="text-gray-600 text-xl max-w-[600px] leading-relaxed">
              From beginner to advanced — Embedded C, MCU peripherals, communication protocols, and RTOS.
            </p>
          </div>
        </div>
      </header>

      <main className="py-24 bg-gradient-to-br from-white to-slate-50">
        <div className="max-w-[1400px] mx-auto px-8">
          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2 mb-12 pb-6 border-b border-gray-200">
            {categories.map(cat => (
              <Button
                key={cat.slug}
                variant={activeTab === cat.slug ? 'default' : 'ghost'}
                size="lg"
                onClick={() => handleTabChange(cat.slug)}
                className={`px-6 py-3 font-semibold transition-all ${
                  activeTab === cat.slug
                    ? 'bg-primary-600 text-white shadow-lg hover:shadow-xl'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300 hover:text-primary-600 hover:shadow-md'
                }`}
              >
                {cat.name}
              </Button>
            ))}
          </div>

          {error && (
            <div className="text-center py-20">
              <p className="text-red-500 mb-4">{error}</p>
              <Button onClick={fetchTutorials} variant="outline">Try Again</Button>
            </div>
          )}

          {/* Tutorial Cards Grid */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {loading
              ? Array(6).fill(0).map((_, i) => <TutorialCardSkeleton key={i} />)
              : tutorials.length === 0
              ? (
                <div className="col-span-3 text-center py-20">
                  <p className="text-gray-400 text-lg mb-2">No tutorials in this category yet</p>
                  <p className="text-gray-500 text-sm">Content is being added. Check back soon!</p>
                </div>
              )
              : tutorials.map((tut) => (
                <Link href={`/tutorials/${tut.slug}`} key={tut._id}
                  className="group bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:border-primary-500 hover:-translate-y-1 transition-all duration-300 no-underline">
                  {tut.imageURL && (
                    <div className="h-[160px] overflow-hidden relative">
                      <img src={tut.imageURL} alt={tut.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex gap-2 flex-wrap mb-3">
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold tracking-wider uppercase border ${DIFFICULTY_COLORS[tut.difficulty] || 'text-gray-500 border-gray-200'}`}>
                        {tut.difficulty}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">{tut.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4 leading-relaxed">{tut.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span className="text-primary-500">⏱</span>
                        {tut.time}
                      </div>
                      <Button variant="default" size="sm" className="shadow-md hover:shadow-lg">View Course</Button>
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

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-primary-700">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-12 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent rounded-3xl" />
            <div className="relative z-10">
              <h2 className="text-white mb-6 text-4xl font-bold">Learn by <span className="text-yellow-300">Building</span></h2>
              <p className="text-white/90 mx-auto mb-8 max-w-[600px] text-lg leading-relaxed">
                Each tutorial is linked to a real project. Grab the code, fire up your hardware, and start building.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Button href="/projects" variant="secondary" size="lg" className="bg-white text-primary-600 hover:bg-gray-100 shadow-lg hover:shadow-xl">Browse Projects</Button>
                <Button href="/resources" variant="ghost" size="lg" className="bg-white/10 text-white border-white/30 hover:bg-white/20 backdrop-blur-sm">Get Source Code</Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Tutorials