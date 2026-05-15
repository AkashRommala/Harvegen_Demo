'use client'

import { useState } from 'react'
import { useUser } from '@/context/UserContext'
import CloudinaryUploader from './CloudinaryUploader'
import { FiLoader } from 'react-icons/fi'

const DIFFICULTIES = ['beginner', 'intermediate', 'advanced']

export default function ProjectForm({ initial = {}, isNew, endpoint, headers, onSuccess, onCancel }) {
  const [form, setForm] = useState({
    title: initial.title || '',
    description: initial.description || '',
    fullContent: initial.fullContent || '',
    difficulty: initial.difficulty || 'beginner',
    mcu: initial.mcu || '',
    imageURL: initial.imageURL || '',
    gitHubLink: initial.gitHubLink || '',
    tags: (initial.tags || []).join(', '),
    featured: initial.featured || false,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const payload = {
        ...form,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      }
      const id = initial.slug || initial._id
      const res = await fetch(isNew ? endpoint : `${endpoint}/${id}`, {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error || JSON.stringify(json.details))
      onSuccess()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">Title *</label>
        <input value={form.title} onChange={e => set('title', e.target.value)} required
          className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-primary-500 transition-colors" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">Short Description *</label>
        <textarea value={form.description} onChange={e => set('description', e.target.value)} required rows={2}
          className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-primary-500 transition-colors resize-none" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">Full Content (Markdown)</label>
        <textarea value={form.fullContent} onChange={e => set('fullContent', e.target.value)} rows={8}
          placeholder="# Project Overview&#10;&#10;Write full Markdown content here..."
          className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm font-mono focus:outline-none focus:border-primary-500 transition-colors resize-y" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Difficulty *</label>
          <select value={form.difficulty} onChange={e => set('difficulty', e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-primary-500 transition-colors">
            {DIFFICULTIES.map(d => <option key={d} value={d}>{d[0].toUpperCase() + d.slice(1)}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">MCU</label>
          <input value={form.mcu} onChange={e => set('mcu', e.target.value)} placeholder="e.g. STM32F407"
            className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-primary-500 transition-colors" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">Tags (comma-separated)</label>
        <input value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="iot, stm32, beginner"
          className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-primary-500 transition-colors" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">GitHub Link</label>
        <input value={form.gitHubLink} onChange={e => set('gitHubLink', e.target.value)} type="url" placeholder="https://github.com/..."
          className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-primary-500 transition-colors" />
      </div>

      <CloudinaryUploader
        label="Project Image"
        folder="harvegen/projects"
        current={form.imageURL}
        onUpload={url => set('imageURL', url)}
      />

      <label className="flex items-center gap-3 cursor-pointer">
        <input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)}
          className="w-4 h-4 rounded border-gray-600 accent-primary-600" />
        <span className="text-sm text-gray-300">Mark as Featured</span>
      </label>

      {error && <p className="text-red-400 text-sm bg-red-900/20 px-4 py-3 rounded-xl">{error}</p>}

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel}
          className="flex-1 px-6 py-2.5 bg-gray-800 text-gray-300 rounded-xl text-sm hover:bg-gray-700 transition-colors">
          Cancel
        </button>
        <button type="submit" disabled={loading}
          className="flex-1 px-6 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
          {loading && <FiLoader className="w-4 h-4 animate-spin" />}
          {isNew ? 'Create Project' : 'Save Changes'}
        </button>
      </div>
    </form>
  )
}
