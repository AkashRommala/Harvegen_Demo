'use client'

import { useState } from 'react'
import { FiSave, FiLoader } from 'react-icons/fi'

export default function CategoryForm({ initial, isNew, endpoint, headers, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    name: initial?.name || '',
    slug: initial?.slug || '',
    description: initial?.description || '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const url = isNew ? endpoint : `${endpoint}/${initial._id}`
      const method = isNew ? 'POST' : 'PUT'

      // Clean empty slug to let server auto-generate it if needed
      const payload = { ...formData }
      if (!payload.slug.trim()) delete payload.slug

      const res = await fetch(url, {
        method,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json()

      if (!json.success) throw new Error(json.error || 'Failed to save category')
      onSuccess()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const inputCls = "w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary-500"

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <div className="bg-red-900/30 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm">{error}</div>}

      <div>
        <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase">Category Name *</label>
        <input
          required
          value={formData.name}
          onChange={e => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g. Embedded C"
          className={inputCls}
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase">Slug</label>
        <input
          value={formData.slug}
          onChange={e => setFormData({ ...formData, slug: e.target.value })}
          placeholder="e.g. embedded-c (Auto-generated if left empty)"
          className={inputCls}
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase">Description</label>
        <textarea
          rows={3}
          value={formData.description}
          onChange={e => setFormData({ ...formData, description: e.target.value })}
          placeholder="Brief description of the category..."
          className={inputCls}
        />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
        <button type="button" onClick={onCancel} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-400 hover:bg-gray-800">
          Cancel
        </button>
        <button type="submit" disabled={loading} className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold flex items-center gap-2">
          {loading ? <FiLoader className="w-4 h-4 animate-spin" /> : <FiSave className="w-4 h-4" />}
          {isNew ? 'Create Category' : 'Save Changes'}
        </button>
      </div>
    </form>
  )
}
