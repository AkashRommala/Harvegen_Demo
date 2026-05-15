'use client'

import { useState, useEffect, useCallback } from 'react'
import { useUser } from '@/context/UserContext'
import { FiSearch, FiFilter, FiPlus, FiEdit2, FiTrash2, FiLoader, FiAlertCircle } from 'react-icons/fi'

/**
 * Generic admin table with search, pagination, and CRUD actions.
 * Consumers pass: endpoint, columns, renderForm, filterOptions
 */
export default function AdminTable({
  title,
  endpoint,
  columns,
  renderForm,
  filterOptions = [],
  idField = '_id',
  rowIdentifier = (row) => row.title || row.name || row._id,
  queryKey = '',
}) {
  const { user } = useUser()
  const [rows, setRows] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('')
  const [page, setPage] = useState(1)
  const [editing, setEditing] = useState(null) // null | 'new' | row object
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)
  const limit = 10

  const headers = { 'x-user-role': user?.role || '', 'x-user-email': user?.email || '' }

  const fetchRows = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({ page, limit })
      if (search) params.set('q', search)
      if (filter) params.set(queryKey || 'filter', filter)
      const res = await fetch(`${endpoint}?${params}`)
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      // Support both { data: [...] } and { data: { items: [...], total } }
      const data = json.data
      const list = Array.isArray(data) ? data : (data[Object.keys(data)[0]] || [])
      setRows(Array.isArray(list) ? list : [])
      setTotal(data.total || list.length)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [endpoint, page, search, filter, queryKey])

  useEffect(() => { fetchRows() }, [fetchRows])

  const handleDelete = async () => {
    if (!deleteTarget) return
    setActionLoading(true)
    try {
      const id = deleteTarget[idField] || deleteTarget._id
      const res = await fetch(`${endpoint}/${id}`, { method: 'DELETE', headers })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      setDeleteTarget(null)
      fetchRows()
    } catch (err) {
      alert(err.message)
    } finally {
      setActionLoading(false)
    }
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          <p className="text-gray-400 text-sm mt-1">{total} total entries</p>
        </div>
        <button
          onClick={() => setEditing('new')}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold transition-all shadow-lg"
        >
          <FiPlus className="w-4 h-4" /> Add New
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 text-sm focus:outline-none focus:border-primary-500 transition-colors"
          />
        </div>
        {filterOptions.length > 0 && (
          <select
            value={filter}
            onChange={(e) => { setFilter(e.target.value); setPage(1) }}
            className="px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white text-sm focus:outline-none focus:border-primary-500 transition-colors"
          >
            <option value="">All</option>
            {filterOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        )}
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <FiLoader className="w-8 h-8 text-primary-400 animate-spin" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center gap-3 py-20 text-red-400">
            <FiAlertCircle className="w-5 h-5" />
            <span className="text-sm">{error}</span>
          </div>
        ) : rows.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-sm">No entries found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  {columns.map((col) => (
                    <th key={col.key} className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {col.label}
                    </th>
                  ))}
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {rows.map((row) => (
                  <tr key={row[idField]} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    {columns.map((col) => (
                      <td key={col.key} className="px-6 py-4 text-gray-700 dark:text-gray-300 max-w-[200px] truncate">
                        {col.render ? col.render(row[col.key], row) : (row[col.key] || '—')}
                      </td>
                    ))}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditing(row)}
                          className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
                          title="Edit"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(row)}
                          className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                          title="Delete"
                        >
                          <FiTrash2 className="w-4 h-4" />
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
          <p className="text-gray-500 text-sm">
            Page {page} of {totalPages} · {total} total
          </p>
          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-transparent text-gray-700 dark:text-gray-300 rounded-xl text-sm disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Previous
            </button>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
              className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-transparent text-gray-700 dark:text-gray-300 rounded-xl text-sm disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Editor Modal */}
      {editing !== null && (
        <div className="fixed inset-0 bg-gray-900/50 dark:bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-gray-900 dark:text-white font-bold text-lg">
                {editing === 'new' ? `New ${title.replace(/s$/, '')}` : `Edit ${rowIdentifier(editing)}`}
              </h2>
              <button onClick={() => setEditing(null)} className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white p-1 transition-colors">✕</button>
            </div>
            <div className="p-6">
              {renderForm({
                initial: editing === 'new' ? {} : editing,
                isNew: editing === 'new',
                endpoint,
                headers,
                onSuccess: () => { setEditing(null); fetchRows() },
                onCancel: () => setEditing(null),
              })}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-gray-900/50 dark:bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 w-full max-w-md shadow-2xl text-center">
            <div className="w-14 h-14 bg-red-50 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiTrash2 className="w-7 h-7 text-red-500 dark:text-red-400" />
            </div>
            <h3 className="text-gray-900 dark:text-white font-bold text-xl mb-2">Delete Entry?</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
              "{rowIdentifier(deleteTarget)}" will be permanently deleted. This cannot be undone.
            </p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setDeleteTarget(null)} className="px-6 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={actionLoading}
                className="px-6 py-2.5 bg-red-600 text-white rounded-xl text-sm hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-60"
              >
                {actionLoading && <FiLoader className="w-4 h-4 animate-spin" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
