'use client'

import { useState } from 'react'
import { FiSave, FiLoader } from 'react-icons/fi'

export default function CourseForm({ initial, isNew, endpoint, headers, onSuccess, onCancel }) {
  const [name, setName] = useState(initial?.name || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) return setError('Course name is required')
    setLoading(true)
    setError(null)
    try {
      const url = isNew ? endpoint : `${endpoint}/${initial._id}`
      const method = isNew ? 'POST' : 'PUT'
      const res = await fetch(url, {
        method,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() }),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error || 'Failed to save course')
      onSuccess()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <div className="bg-red-900/30 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm">{error}</div>}

      <div>
        <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase">Course Name *</label>
        <input
          required
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="e.g. Embedded C"
          className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary-500"
        />
        <p className="text-xs text-gray-500 mt-1">Slug is auto-generated from the name.</p>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
        <button type="button" onClick={onCancel} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-400 hover:bg-gray-800">
          Cancel
        </button>
        <button type="submit" disabled={loading} className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold flex items-center gap-2">
          {loading ? <FiLoader className="w-4 h-4 animate-spin" /> : <FiSave className="w-4 h-4" />}
          {isNew ? 'Create Course' : 'Save Changes'}
        </button>
      </div>
    </form>
  )
}
