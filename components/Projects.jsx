'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { FiGlobe, FiCpu, FiRadio, FiLayers, FiTarget, FiZap } from 'react-icons/fi'
import { Button } from './ui/button'
import { ProjectCardSkeleton } from './ui/skeletons'

// Icon mapping by mcu/tag keyword
const getIcon = (tags = []) => {
  const t = tags.join(' ').toLowerCase()
  if (t.includes('iot')) return FiGlobe
  if (t.includes('rtos') || t.includes('freertos')) return FiLayers
  if (t.includes('uart') || t.includes('spi') || t.includes('i2c')) return FiRadio
  if (t.includes('advanced')) return FiTarget
  return FiZap
}

const FILTERS = ['all', 'beginner', 'intermediate', 'advanced', 'iot', 'stm32', 'lpc', 'arduino']

function Projects() {
  const [projects, setProjects] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all')
  const [page, setPage] = useState(1)
  const limit = 9

  const fetchProjects = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({ page, limit })
      // difficulty filter
      if (['beginner', 'intermediate', 'advanced'].includes(filter)) {
        params.set('difficulty', filter)
      } else if (filter !== 'all') {
        // tag-based filter via search
        params.set('q', filter)
      }
      const res = await fetch(`/api/projects?${params}`)
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      setProjects(json.data.projects || [])
      setTotal(json.data.total || 0)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [filter, page])

  useEffect(() => { fetchProjects() }, [fetchProjects])

  const totalPages = Math.ceil(total / limit)

  return (
    <>
      {/* Page Hero */}
      <header className="pt-[120px] pb-20 relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-primary-50/30">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/3 via-primary-500/8 to-transparent rounded-full blur-3xl animate-gradient" />
        <div className="absolute w-[800px] h-[800px] rounded-full bg-gradient-to-r from-primary-500/15 to-primary-500/8 top-1/2 left-1/2 -translate-x-3/5 -translate-y-2/5 pointer-events-none animate-float" />
        <div className="max-w-[1400px] mx-auto px-8 w-full relative z-10">
          <div className="text-sm text-gray-500 mb-6 font-mono animate-fade-in">
            <Link href="/" className="text-gray-400 hover:text-primary-600 transition-colors">Home</Link>
            <span className="text-gray-400"> / </span>
            <span className="text-primary-600">Projects</span>
          </div>
          <div className="space-y-6 animate-slide-up">
            <div className="inline-flex items-center gap-3 mb-4 font-semibold text-sm tracking-widest uppercase text-primary-600">
              <span className="w-8 h-px bg-primary-600" />
              Build Real Systems
            </div>
            <h1 className="text-gray-900 font-display text-5xl md:text-6xl font-bold leading-tight">
              Embedded<br /><span className="text-primary-600">Projects</span>
            </h1>
            <p className="text-gray-600 text-xl max-w-[600px] leading-relaxed">
              Real-world projects with full source code, schematics, and step-by-step explanations.
            </p>
          </div>
        </div>
      </header>

      <main className="py-24 bg-gradient-to-br from-white to-slate-50">
        <div className="max-w-[1400px] mx-auto px-8">
          {/* Filter Bar */}
          <div className="flex flex-wrap gap-3 mb-12 p-6 bg-white border border-gray-200 rounded-2xl shadow-lg">
            {FILTERS.map(f => (
              <Button
                key={f}
                variant={filter === f ? 'default' : 'ghost'}
                size="lg"
                onClick={() => { setFilter(f); setPage(1) }}
                className={`px-6 py-3 font-semibold transition-all ${
                  filter === f
                    ? 'bg-primary-600 text-white shadow-lg hover:shadow-xl'
                    : 'bg-gray-50 text-gray-600 border border-gray-200 hover:border-primary-300 hover:text-primary-600 hover:shadow-md'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Button>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="text-center py-20">
              <p className="text-red-500 mb-4">{error}</p>
              <Button onClick={fetchProjects} variant="outline">Try Again</Button>
            </div>
          )}

          {/* Projects Grid */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {loading
              ? Array(6).fill(0).map((_, i) => <ProjectCardSkeleton key={i} />)
              : projects.length === 0
              ? (
                <div className="col-span-3 text-center py-20">
                  <p className="text-gray-400 text-lg mb-2">No projects found</p>
                  <p className="text-gray-500 text-sm">Try a different filter or check back later.</p>
                </div>
              )
              : projects.map((proj) => {
                const Icon = getIcon(proj.tags)
                return (
                  <article key={proj._id} className="group bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:border-primary-500 hover:-translate-y-1 transition-all duration-300">
                    <div className="h-[200px] bg-gradient-to-br from-primary-50 to-primary-100 shadow-sm flex items-center justify-center overflow-hidden relative">
                      {proj.imageURL ? (
                        <img src={proj.imageURL} alt={proj.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <Icon className="w-16 h-16 text-primary-300" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="p-6 pb-0">
                      <div className="flex gap-2 flex-wrap mb-3">
                        {proj.tags.map((tag, j) => (
                          <span key={j} className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold tracking-wider uppercase border ${
                            tag === 'beginner' ? 'text-emerald-700 border-emerald-200 bg-emerald-50' :
                            tag === 'intermediate' ? 'text-amber-700 border-amber-200 bg-amber-50' :
                            tag === 'advanced' ? 'text-red-700 border-red-200 bg-red-50' :
                            'text-blue-700 border-blue-200 bg-blue-50'
                          }`}>{tag}</span>
                        ))}
                      </div>
                      <h3 className="font-bold text-lg text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">{proj.title}</h3>
                      <p className="text-gray-600 text-sm line-clamp-2 mb-4 leading-relaxed">{proj.description}</p>
                      {proj.mcu && (
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
                          <span className="text-xs text-gray-500">{proj.mcu}</span>
                        </div>
                      )}
                    </div>
                    <div className="p-6 flex justify-between items-center border-t border-gray-100 bg-gray-50/50">
                      <span className="text-xs text-gray-500 font-medium">{proj.difficulty}</span>
                      <div className="flex gap-2">
                        {proj.gitHubLink && (
                          <a href={proj.gitHubLink} target="_blank" rel="noopener noreferrer"
                            className="px-3 py-1.5 bg-gray-900 text-white rounded-lg text-xs font-semibold hover:bg-gray-700 transition-colors">
                            GitHub
                          </a>
                        )}
                        <Link href={`/projects/${proj.slug}`}>
                          <Button variant="outline" size="sm" className="shadow-sm hover:shadow-md">View Details</Button>
                        </Link>
                      </div>
                    </div>
                  </article>
                )
              })
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
              <h2 className="text-white mb-6 text-4xl font-bold">Download <span className="text-yellow-300">Source Code</span></h2>
              <p className="text-white/90 mx-auto mb-8 max-w-[600px] text-lg leading-relaxed">
                Download full project code, circuit schematics, and component lists for free.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Button href="/resources" variant="secondary" size="lg" className="bg-white text-primary-600 hover:bg-gray-100 shadow-lg hover:shadow-xl">Download Code</Button>
                <Button href="/tutorials" variant="ghost" size="lg" className="bg-white/10 text-white border-white/30 hover:bg-white/20 backdrop-blur-sm">Read Tutorials</Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Projects