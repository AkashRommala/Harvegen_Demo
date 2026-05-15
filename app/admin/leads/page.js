'use client'

import { useState, useEffect, useCallback } from 'react'
import { useUser } from '@/context/UserContext'
import { FiMail, FiLoader, FiTrash2, FiDownload, FiRefreshCw, FiCheck } from 'react-icons/fi'

const STATUS_COLORS = {
  new: 'text-blue-400 bg-blue-900/30 border-blue-700/30',
  read: 'text-gray-400 bg-gray-800 border-gray-700',
  replied: 'text-emerald-400 bg-emerald-900/30 border-emerald-700/30',
  archived: 'text-amber-400 bg-amber-900/30 border-amber-700/30',
}

export default function AdminLeadsPage() {
  const { user } = useUser()
  const [leads, setLeads] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState(null) // lead detail modal
  const limit = 20

  const headers = { 'x-user-role': user?.role || '', 'x-user-email': user?.email || '' }

  const fetchLeads = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page, limit })
      if (status) params.set('status', status)
      const res = await fetch(`/api/contact?${params}`, { headers })
      const json = await res.json()
      if (json.success) {
        setLeads(json.data.leads || [])
        setTotal(json.data.total || 0)
      }
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }, [page, status])

  useEffect(() => { fetchLeads() }, [fetchLeads])

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify({ status: newStatus }),
      })
      const json = await res.json()
      if (json.success) {
        setLeads(l => l.map(lead => lead._id === id ? { ...lead, status: newStatus } : lead))
        if (selected?._id === id) setSelected(s => ({ ...s, status: newStatus }))
      }
    } catch (err) { console.error(err) }
  }

  const deleteLead = async (id) => {
    if (!confirm('Delete this lead permanently?')) return
    try {
      const res = await fetch(`/api/contact/${id}`, { method: 'DELETE', headers })
      const json = await res.json()
      if (json.success) {
        setLeads(l => l.filter(lead => lead._id !== id))
        setTotal(t => t - 1)
        if (selected?._id === id) setSelected(null)
      }
    } catch (err) { console.error(err) }
  }

  const exportCSV = () => {
    const rows = [['Name', 'Email', 'Subject', 'Message', 'Status', 'Date']]
    leads.forEach(l => rows.push([l.name, l.email, l.subject || '', l.message, l.status, new Date(l.createdAt).toLocaleDateString()]))
    const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'leads.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Leads / CRM</h1>
          <p className="text-gray-400 text-sm mt-1">{total} contact form submissions</p>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchLeads} className="flex items-center gap-2 px-4 py-2.5 bg-gray-800 text-gray-300 rounded-xl text-sm hover:bg-gray-700 transition-colors">
            <FiRefreshCw className="w-4 h-4" /> Refresh
          </button>
          <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors">
            <FiDownload className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {[{ value: '', label: 'All' }, { value: 'new', label: 'New' }, { value: 'read', label: 'Read' }, { value: 'replied', label: 'Replied' }, { value: 'archived', label: 'Archived' }].map(s => (
          <button key={s.value} onClick={() => { setStatus(s.value); setPage(1) }}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${status === s.value ? 'bg-primary-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
            {s.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20"><FiLoader className="w-8 h-8 text-primary-400 animate-spin" /></div>
        ) : leads.length === 0 ? (
          <div className="text-center py-20"><FiMail className="w-12 h-12 text-gray-700 mx-auto mb-3" /><p className="text-gray-500 text-sm">No leads found</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-gray-800">
                {['Name', 'Email', 'Subject', 'Status', 'Date', 'Actions'].map(h => (
                  <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr></thead>
              <tbody className="divide-y divide-gray-800">
                {leads.map(lead => (
                  <tr key={lead._id} className="hover:bg-gray-800/50 cursor-pointer transition-colors" onClick={() => setSelected(lead)}>
                    <td className="px-6 py-4 text-white font-medium">{lead.name}</td>
                    <td className="px-6 py-4 text-gray-400 font-mono text-xs">{lead.email}</td>
                    <td className="px-6 py-4 text-gray-400 max-w-[160px] truncate">{lead.subject || '—'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-lg text-xs font-bold border ${STATUS_COLORS[lead.status]}`}>{lead.status}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs">{new Date(lead.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center gap-2">
                        <select value={lead.status} onChange={e => updateStatus(lead._id, e.target.value)}
                          className="bg-gray-800 border border-gray-700 text-gray-300 text-xs rounded-lg px-2 py-1 focus:outline-none">
                          {['new', 'read', 'replied', 'archived'].map(s => <option key={s}>{s}</option>)}
                        </select>
                        <button onClick={() => deleteLead(lead._id)} className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-all">
                          <FiTrash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-gray-500 text-sm">Page {page} of {totalPages}</p>
          <div className="flex gap-2">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-4 py-2 bg-gray-800 text-gray-300 rounded-xl text-sm disabled:opacity-40 hover:bg-gray-700">Previous</button>
            <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="px-4 py-2 bg-gray-800 text-gray-300 rounded-xl text-sm disabled:opacity-40 hover:bg-gray-700">Next</button>
          </div>
        </div>
      )}

      {/* Lead Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
              <h2 className="text-white font-bold">Lead Details</h2>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-white">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-gray-500 text-xs mb-1">Name</p><p className="text-white font-medium">{selected.name}</p></div>
                <div><p className="text-gray-500 text-xs mb-1">Email</p><p className="text-primary-400 font-mono text-sm">{selected.email}</p></div>
                <div><p className="text-gray-500 text-xs mb-1">Subject</p><p className="text-gray-300 text-sm">{selected.subject || '—'}</p></div>
                <div><p className="text-gray-500 text-xs mb-1">Date</p><p className="text-gray-300 text-sm">{new Date(selected.createdAt).toLocaleString()}</p></div>
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-2">Message</p>
                <div className="bg-gray-800 rounded-xl p-4 text-gray-300 text-sm leading-relaxed">{selected.message}</div>
              </div>
              <div className="flex gap-3">
                {['new', 'read', 'replied', 'archived'].map(s => (
                  <button key={s} onClick={() => updateStatus(selected._id, s)}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-colors ${selected.status === s ? 'bg-primary-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
                    {s[0].toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
