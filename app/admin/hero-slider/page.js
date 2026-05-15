'use client'

import { useState } from 'react'
import AdminTable from '@/components/admin/AdminTable'
import CloudinaryUploader from '@/components/admin/CloudinaryUploader'
import { FiLoader } from 'react-icons/fi'

const columns = [
  { key: 'imageURL', label: '', render: v => v ? <img src={v} alt="" className="w-16 h-10 rounded-lg object-cover" /> : <div className="w-16 h-10 rounded-lg bg-gray-700" /> },
  { key: 'title', label: 'Title' },
  { key: 'subtitle', label: 'Subtitle', render: v => <span className="text-xs text-gray-500">{v}</span> },
  { key: 'orderIndex', label: 'Order', render: v => <span className="text-primary-400 font-bold text-sm">#{v}</span> },
  { key: 'isActive', label: 'Active', render: v => <span className={`text-xs font-bold ${v ? 'text-emerald-400' : 'text-red-400'}`}>{v ? '● Active' : '○ Hidden'}</span> },
]

function SliderForm({ initial = {}, isNew, endpoint, headers, onSuccess, onCancel }) {
  const [form, setForm] = useState({
    title: initial.title || '',
    subtitle: initial.subtitle || '',
    description: initial.description || '',
    ctaText: initial.ctaText || 'Explore',
    ctaLink: initial.ctaLink || '/projects',
    imageURL: initial.imageURL || '',
    orderIndex: initial.orderIndex ?? 0,
    isActive: initial.isActive ?? true,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const id = initial._id
      const res = await fetch(isNew ? endpoint : `${endpoint}/${id}`, {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify(form),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      onSuccess()
    } catch (err) { setError(err.message) } finally { setLoading(false) }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div><label className="block text-sm font-medium text-gray-300 mb-1.5">Title *</label>
        <input value={form.title} onChange={e => set('title', e.target.value)} required className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-primary-500" /></div>
      <div><label className="block text-sm font-medium text-gray-300 mb-1.5">Subtitle</label>
        <input value={form.subtitle} onChange={e => set('subtitle', e.target.value)} className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-primary-500" /></div>
      <div><label className="block text-sm font-medium text-gray-300 mb-1.5">Description</label>
        <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={2} className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-primary-500 resize-none" /></div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium text-gray-300 mb-1.5">CTA Text</label>
          <input value={form.ctaText} onChange={e => set('ctaText', e.target.value)} className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-primary-500" /></div>
        <div><label className="block text-sm font-medium text-gray-300 mb-1.5">CTA Link</label>
          <input value={form.ctaLink} onChange={e => set('ctaLink', e.target.value)} className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-primary-500" /></div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium text-gray-300 mb-1.5">Order Index</label>
          <input type="number" value={form.orderIndex} onChange={e => set('orderIndex', parseInt(e.target.value) || 0)} className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-primary-500" /></div>
        <div className="flex items-end pb-1">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.isActive} onChange={e => set('isActive', e.target.checked)} className="w-4 h-4 accent-primary-600" />
            <span className="text-sm text-gray-300">Active (visible on site)</span>
          </label>
        </div>
      </div>
      <CloudinaryUploader label="Slide Image *" folder="harvegen/slides" current={form.imageURL} onUpload={url => set('imageURL', url)} />
      {error && <p className="text-red-400 text-sm bg-red-900/20 px-4 py-3 rounded-xl">{error}</p>}
      <div className="flex gap-3">
        <button type="button" onClick={onCancel} className="flex-1 px-6 py-2.5 bg-gray-800 text-gray-300 rounded-xl text-sm hover:bg-gray-700 transition-colors">Cancel</button>
        <button type="submit" disabled={loading} className="flex-1 px-6 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-semibold hover:bg-primary-700 flex items-center justify-center gap-2 disabled:opacity-60">
          {loading && <FiLoader className="w-4 h-4 animate-spin" />} {isNew ? 'Create Slide' : 'Save'}
        </button>
      </div>
    </form>
  )
}

export default function AdminHeroSliderPage() {
  return (
    <AdminTable title="Hero Slides" endpoint="/api/hero-slider" columns={columns}
      idField="_id" rowIdentifier={r => r.title}
      renderForm={props => <SliderForm {...props} />}
    />
  )
}
