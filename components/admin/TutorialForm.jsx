'use client'

import { useState } from 'react'
import CloudinaryUploader from './CloudinaryUploader'
import { FiLoader, FiPlus, FiTrash2, FiCode } from 'react-icons/fi'
import Editor from '@monaco-editor/react'

const CATEGORIES = [
  { value: 'c', label: 'Embedded C' },
  { value: 'basics', label: 'MCU Basics' },
  { value: 'proto', label: 'Protocols' },
  { value: 'rtos', label: 'RTOS' },
]
const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced']

export default function TutorialForm({ initial = {}, isNew, endpoint, headers, onSuccess, onCancel }) {
  const [form, setForm] = useState({
    title: initial.title || '',
    category: initial.category || 'c',
    description: initial.description || '',
    summary: initial.summary || '',
    time: initial.time || '',
    difficulty: initial.difficulty || 'Beginner',
    imageURL: initial.imageURL || '',
    featured: initial.featured || false,
    learningPoints: initial.learningPoints?.length > 0 ? initial.learningPoints : [''],
    markdownContent: initial.markdownContent || '',
    codeSections: initial.codeSections || []
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const updateLearningPoint = (index, value) => {
    const newPoints = [...form.learningPoints]
    newPoints[index] = value
    set('learningPoints', newPoints)
  }

  const addLearningPoint = () => {
    set('learningPoints', [...form.learningPoints, ''])
  }

  const removeLearningPoint = (index) => {
    if (form.learningPoints.length === 1) return
    const newPoints = form.learningPoints.filter((_, i) => i !== index)
    set('learningPoints', newPoints)
  }

  const addCodeSection = () => {
    set('codeSections', [...form.codeSections, { title: 'New Example', language: 'c', initialCode: '#include <stdio.h>\n\nint main() {\n    printf("Hello World!\\n");\n    return 0;\n}' }])
  }

  const updateCodeSection = (index, field, value) => {
    const newSections = [...form.codeSections]
    newSections[index] = { ...newSections[index], [field]: value }
    set('codeSections', newSections)
  }

  const removeCodeSection = (index) => {
    const newSections = form.codeSections.filter((_, i) => i !== index)
    set('codeSections', newSections)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      if (!form.markdownContent.trim()) {
        throw new Error("Markdown content is required.")
      }
      
      const cleanedForm = {
        ...form,
        learningPoints: form.learningPoints.filter(p => p.trim() !== '')
      }

      const id = initial.slug || initial._id
      const res = await fetch(isNew ? endpoint : `${endpoint}/${id}`, {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify(cleanedForm),
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
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Title *</label>
        <input value={form.title} onChange={e => set('title', e.target.value)} required
          className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white text-sm focus:outline-none focus:border-primary-500 transition-colors" />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Category *</label>
          <select value={form.category} onChange={e => set('category', e.target.value)}
            className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white text-sm focus:outline-none focus:border-primary-500 transition-colors">
            {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Difficulty *</label>
          <select value={form.difficulty} onChange={e => set('difficulty', e.target.value)}
            className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white text-sm focus:outline-none focus:border-primary-500 transition-colors">
            {DIFFICULTIES.map(d => <option key={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Duration *</label>
          <input value={form.time} onChange={e => set('time', e.target.value)} placeholder="e.g. 25 min" required
            className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white text-sm focus:outline-none focus:border-primary-500 transition-colors" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description (SEO) *</label>
        <textarea value={form.description} onChange={e => set('description', e.target.value)} required rows={2}
          className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white text-sm focus:outline-none focus:border-primary-500 transition-colors resize-none" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Summary (Hero subtitle)</label>
        <textarea value={form.summary} onChange={e => set('summary', e.target.value)} rows={2}
          className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white text-sm focus:outline-none focus:border-primary-500 transition-colors resize-none" />
      </div>

      {/* Learning Points Builder */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">What You'll Learn</h3>
          <button type="button" onClick={addLearningPoint}
            className="flex items-center gap-1.5 px-2 py-1 bg-primary-100 dark:bg-primary-600/20 text-primary-600 dark:text-primary-400 rounded-md text-xs hover:bg-primary-200 dark:hover:bg-primary-600/30 transition-colors">
            <FiPlus className="w-3 h-3" /> Add Point
          </button>
        </div>
        <div className="space-y-2">
          {form.learningPoints.map((point, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <input 
                value={point} 
                onChange={e => updateLearningPoint(idx, e.target.value)}
                placeholder="e.g. Understand how GPIO pins work" 
                className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white text-sm focus:outline-none focus:border-primary-500 transition-colors"
              />
              <button type="button" onClick={() => removeLearningPoint(idx)} disabled={form.learningPoints.length === 1}
                className="p-2 text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 bg-gray-50 dark:bg-gray-900 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                <FiTrash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Markdown Content *</label>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Use `:::info`, `:::warning`, `:::note`, or `:::` wrappers to create highlighted boxes!</p>
        <textarea value={form.markdownContent} onChange={e => set('markdownContent', e.target.value)} required rows={16}
          className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white font-mono text-sm focus:outline-none focus:border-primary-500 transition-colors resize-y" />
      </div>

      {/* Code Snippets Builder */}
      <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <FiCode className="w-4 h-4" /> Code Snippets / Playgrounds
            </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Add runnable C code examples to your tutorial. To embed them in the markdown, type <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">[[CODE_1]]</code>, <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">[[CODE_2]]</code> etc. on a new line.</p>
          </div>
          <button type="button" onClick={addCodeSection}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors">
            <FiPlus className="w-4 h-4" /> Add Snippet
          </button>
        </div>

        <div className="space-y-6">
          {form.codeSections.map((section, idx) => (
            <div key={idx} className="p-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl space-y-4 relative">
              <button type="button" onClick={() => removeCodeSection(idx)}
                className="absolute top-4 right-4 p-1.5 text-red-500 hover:text-white hover:bg-red-500 rounded transition-colors">
                <FiTrash2 className="w-4 h-4" />
              </button>
              
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Snippet Title</label>
                <input 
                  value={section.title} 
                  onChange={e => updateCodeSection(idx, 'title', e.target.value)}
                  placeholder="e.g. Example 1: Hello World" 
                  className="w-full max-w-sm px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-primary-500"
                />
              </div>

              <div className="h-[300px] border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <Editor
                  height="100%"
                  language={section.language}
                  theme="vs-dark"
                  value={section.initialCode}
                  onChange={(val) => updateCodeSection(idx, 'initialCode', val)}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    padding: { top: 16 },
                    scrollBeyondLastLine: false,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <CloudinaryUploader
        label="Tutorial Image Cover"
        folder="harvegen/tutorials"
        current={form.imageURL}
        onUpload={url => set('imageURL', url)}
      />

      <label className="flex items-center gap-3 cursor-pointer">
        <input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)}
          className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 accent-primary-600" />
        <span className="text-sm text-gray-700 dark:text-gray-300">Mark as Featured</span>
      </label>

      {error && <p className="text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 px-4 py-3 rounded-xl border border-red-200 dark:border-transparent">{error}</p>}

      <div className="flex gap-3 pt-4">
        <button type="button" onClick={onCancel} className="flex-1 px-6 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Cancel</button>
        <button type="submit" disabled={loading}
          className="flex-1 px-6 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
          {loading && <FiLoader className="w-4 h-4 animate-spin" />}
          {isNew ? 'Create Tutorial' : 'Save Changes'}
        </button>
      </div>
    </form>
  )
}
