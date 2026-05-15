'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FiLayers, FiBookOpen, FiPackage, FiMail, FiImage, FiTrendingUp, FiLoader } from 'react-icons/fi'

const CARDS = [
  { label: 'Projects', endpoint: '/api/projects', icon: FiLayers, href: '/admin/projects', color: 'from-blue-600 to-blue-700' },
  { label: 'Tutorials', endpoint: '/api/tutorials', icon: FiBookOpen, href: '/admin/tutorials', color: 'from-emerald-600 to-emerald-700' },
  { label: 'Resources', endpoint: '/api/resources', icon: FiPackage, href: '/admin/resources', color: 'from-violet-600 to-violet-700' },
  { label: 'Leads', endpoint: '/api/contact', icon: FiMail, href: '/admin/leads', color: 'from-amber-600 to-amber-700' },
]

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      const results = await Promise.allSettled(
        CARDS.map(c => fetch(`${c.endpoint}?limit=1`).then(r => r.json()))
      )
      const s = {}
      CARDS.forEach((c, i) => {
        const r = results[i]
        if (r.status === 'fulfilled' && r.value.success) {
          const d = r.value.data
          s[c.label] = d.total ?? (Array.isArray(d) ? d.length : '—')
        } else {
          s[c.label] = '—'
        }
      })
      setStats(s)
      setLoading(false)
    }
    fetchStats()
  }, [])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-1">Welcome to the Harvegen Admin CMS. Manage all platform content from here.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {CARDS.map(({ label, icon: Icon, href, color }) => (
          <Link key={label} href={href}
            className="group bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-gray-600 transition-all hover:-translate-y-0.5 hover:shadow-xl">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {loading ? <FiLoader className="w-6 h-6 animate-spin text-gray-600" /> : stats[label] ?? 0}
            </div>
            <div className="text-gray-400 text-sm font-medium">{label}</div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
          <FiTrendingUp className="w-5 h-5 text-primary-400" /> Quick Actions
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Add Project', href: '/admin/projects', desc: 'Create a new embedded project' },
            { label: 'Add Tutorial', href: '/admin/tutorials', desc: 'Write a new tutorial article' },
            { label: 'Add Resource', href: '/admin/resources', desc: 'Upload a datasheet or tool' },
            { label: 'View Leads', href: '/admin/leads', desc: 'Check contact form submissions' },
          ].map(a => (
            <Link key={a.label} href={a.href}
              className="flex flex-col gap-1 p-4 bg-gray-800/60 hover:bg-gray-800 border border-gray-700 hover:border-primary-600/50 rounded-xl transition-all group">
              <span className="text-white text-sm font-semibold group-hover:text-primary-400 transition-colors">{a.label}</span>
              <span className="text-gray-500 text-xs">{a.desc}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-primary-600/10 border border-primary-600/20 rounded-2xl p-6">
        <h3 className="text-primary-400 font-semibold mb-2">🚀 CMS Active</h3>
        <p className="text-gray-400 text-sm leading-relaxed">
          All content is now database-driven. Changes made here are immediately reflected on the live site.
          The API is protected with RBAC — only admin users can write or delete data.
        </p>
      </div>
    </div>
  )
}
