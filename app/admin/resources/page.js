'use client'

import { useState } from 'react'
import AdminTable from '@/components/admin/AdminTable'
import CloudinaryUploader from '@/components/admin/CloudinaryUploader'
import { FiLoader } from 'react-icons/fi'

const TYPE_COLORS = {
  'source-code': 'text-blue-400',
  'datasheet': 'text-violet-400',
  'tool': 'text-emerald-400',
  'link': 'text-amber-400',
  'library': 'text-pink-400',
}

const columns = [
  { key: 'imageURL', label: '', render: v => v ? <img src={v} alt="" className="w-10 h-10 rounded-lg object-cover" /> : <div className="w-10 h-10 rounded-lg bg-gray-700" /> },
  { key: 'name', label: 'Name' },
  { key: 'type', label: 'Type', render: v => <span className={`text-xs font-bold ${TYPE_COLORS[v] || 'text-gray-400'}`}>{v}</span> },
  { key: 'metaData', label: 'Meta', render: v => <span className="text-xs text-gray-500 truncate">{v}</span> },
]

function ResourceForm({ initial = {}, isNew, endpoint, headers, onSuccess, onCancel }) {
  const [form, setForm] = useState({
    name: initial.name || '',
    type: initial.type || 'source-code',
    metaData: initial.metaData || '',
    description: initial.description || '',
    link: initial.link || '',
    imageURL: initial.imageURL || '',
    tags: (initial.tags || []).join(', '),
    featured: initial.featured || false,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const payload = { ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) }
      const id = initial._id
      const res = await fetch(isNew ? endpoint : `${endpoint}/${id}`, {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      onSuccess()
    } catch (err) { setError(err.message) } finally { setLoading(false) }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div><label className="block text-sm font-medium text-gray-300 mb-1.5">Name *</label>
        <input value={form.name} onChange={e => set('name', e.target.value)} required className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-primary-500" /></div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium text-gray-300 mb-1.5">Type *</label>
          <select value={form.type} onChange={e => set('type', e.target.value)} className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-primary-500">
            {['source-code', 'datasheet', 'tool', 'link', 'library'].map(t => <option key={t} value={t}>{t}</option>)}
          </select></div>
        <div><label className="block text-sm font-medium text-gray-300 mb-1.5">Meta Data</label>
          <input value={form.metaData} onChange={e => set('metaData', e.target.value)} placeholder="PDF · 840 pages" className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-primary-500" /></div>
      </div>
      <div><label className="block text-sm font-medium text-gray-300 mb-1.5">Description</label>
        <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={2} className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-primary-500 resize-none" /></div>
      <div><label className="block text-sm font-medium text-gray-300 mb-1.5">Link / URL</label>
        <input value={form.link} onChange={e => set('link', e.target.value)} type="url" placeholder="https://..." className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-primary-500" /></div>
      <div><label className="block text-sm font-medium text-gray-300 mb-1.5">Tags (comma-separated)</label>
        <input value={form.tags} onChange={e => set('tags', e.target.value)} className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-primary-500" /></div>
      <CloudinaryUploader label="Image" folder="harvegen/resources" current={form.imageURL} onUpload={url => set('imageURL', url)} />
      <label className="flex items-center gap-3 cursor-pointer">
        <input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)} className="w-4 h-4 accent-primary-600" />
        <span className="text-sm text-gray-300">Featured</span>
      </label>
      {error && <p className="text-red-400 text-sm bg-red-900/20 px-4 py-3 rounded-xl">{error}</p>}
      <div className="flex gap-3">
        <button type="button" onClick={onCancel} className="flex-1 px-6 py-2.5 bg-gray-800 text-gray-300 rounded-xl text-sm hover:bg-gray-700 transition-colors">Cancel</button>
        <button type="submit" disabled={loading} className="flex-1 px-6 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-semibold hover:bg-primary-700 flex items-center justify-center gap-2 disabled:opacity-60">
          {loading && <FiLoader className="w-4 h-4 animate-spin" />} {isNew ? 'Create' : 'Save'}
        </button>
      </div>
    </form>
  )
}

export default function AdminResourcesPage() {
  return (
    <AdminTable title="Resources" endpoint="/api/resources" columns={columns}
      idField="_id" rowIdentifier={r => r.name}
      filterOptions={[
        { value: 'source-code', label: 'Source Code' }, { value: 'datasheet', label: 'Datasheet' },
        { value: 'tool', label: 'Tool' }, { value: 'link', label: 'Link' }, { value: 'library', label: 'Library' },
      ]}
      queryKey="type"
      renderForm={props => <ResourceForm {...props} />}
    />
  )
}
