'use client'

import { useState, useEffect } from 'react'
import { FiLoader, FiPlus, FiTrash2, FiCode, FiChevronUp, FiChevronDown } from 'react-icons/fi'
import Editor from '@monaco-editor/react'

const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced']

// ─── Reusable string list builder ─────────────────────────────────────────────
function StringListBuilder({ label, items, onAdd, onRemove, onChange, placeholder, helpText }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between border-b border-gray-700 pb-2">
        <div>
          <h3 className="text-sm font-semibold text-white">{label}</h3>
          {helpText && <p className="text-xs text-gray-400 mt-0.5">{helpText}</p>}
        </div>
        <button type="button" onClick={onAdd}
          className="flex items-center gap-1.5 px-2 py-1 bg-primary-600/20 text-primary-400 rounded-md text-xs hover:bg-primary-600/30 transition-colors">
          <FiPlus className="w-3 h-3" /> Add
        </button>
      </div>
      <div className="space-y-2">
        {items.map((item, idx) => (
          <div key={idx} className="flex gap-2 items-center">
            <input
              value={item}
              onChange={e => onChange(idx, e.target.value)}
              placeholder={placeholder}
              className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500 transition-colors"
            />
            <button type="button" onClick={() => onRemove(idx)} disabled={items.length === 1}
              className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded disabled:opacity-30 transition-colors">
              <FiTrash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function TutorialForm({ initial = {}, isNew, endpoint, headers, onSuccess, onCancel }) {
  const [form, setForm] = useState({
    title: initial.title || '',
    category: initial.category || '',
    description: initial.description || '',
    summary: initial.summary || '',
    time: initial.time || '',
    difficulty: initial.difficulty || 'Beginner',
    featured: initial.featured || false,
    // New structured fields
    topics: initial.topics?.length > 0 ? initial.topics : [''],
    whatYoullLearn: initial.whatYoullLearn?.length > 0 ? initial.whatYoullLearn : [''],
    topicsCovered: initial.topicsCovered?.length > 0 ? initial.topicsCovered : [''],
    sections: initial.sections?.length > 0 ? initial.sections : [{ heading: '', description: '' }],
    practiceExercises: initial.practiceExercises?.length > 0 ? initial.practiceExercises : [''],
    prerequisites: initial.prerequisites?.length > 0 ? initial.prerequisites : [''],
    additionalResources: initial.additionalResources?.length > 0
      ? initial.additionalResources
      : [{ label: '', url: '' }],
    codeSections: initial.codeSections || [],
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [categoriesList, setCategoriesList] = useState([])

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data.length > 0) {
          setCategoriesList(json.data)
          if (!form.category) set('category', json.data[0].slug)
        }
      })
      .catch(err => console.error('Failed to load categories', err))
  }, [])

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  // ─── Topics (legacy) ─────────────────────────────────────────────────────────────────────────
  const updateTopic = (i, v) => { const a = [...form.topics]; a[i] = v; set('topics', a) }
  const addTopic = () => set('topics', [...form.topics, ''])
  const removeTopic = (i) => { if (form.topics.length === 1) return; set('topics', form.topics.filter((_, x) => x !== i)) }

  // ─── What You'll Learn ─────────────────────────────────────────────────────────────
  const updateLearnItem = (i, v) => { const a = [...form.whatYoullLearn]; a[i] = v; set('whatYoullLearn', a) }
  const addLearnItem = () => set('whatYoullLearn', [...form.whatYoullLearn, ''])
  const removeLearnItem = (i) => { if (form.whatYoullLearn.length === 1) return; set('whatYoullLearn', form.whatYoullLearn.filter((_, x) => x !== i)) }

  // ─── Topics Covered ──────────────────────────────────────────────────────────────
  const updateCoveredTopic = (i, v) => { const a = [...form.topicsCovered]; a[i] = v; set('topicsCovered', a) }
  const addCoveredTopic = () => set('topicsCovered', [...form.topicsCovered, ''])
  const removeCoveredTopic = (i) => { if (form.topicsCovered.length === 1) return; set('topicsCovered', form.topicsCovered.filter((_, x) => x !== i)) }

  // ─── Sections ─────────────────────────────────────────────────────────────
  const addSection = () => set('sections', [...form.sections, { heading: '', description: '' }])
  const removeSection = (i) => { if (form.sections.length === 1) return; set('sections', form.sections.filter((_, x) => x !== i)) }
  const updateSection = (i, field, val) => {
    const a = [...form.sections]; a[i] = { ...a[i], [field]: val }; set('sections', a)
  }
  const moveSection = (i, dir) => {
    const a = [...form.sections]
    const swap = i + dir
    if (swap < 0 || swap >= a.length) return
    ;[a[i], a[swap]] = [a[swap], a[i]]
    set('sections', a)
  }

  // ─── Practice Exercises ───────────────────────────────────────────────────
  const updateExercise = (i, v) => { const a = [...form.practiceExercises]; a[i] = v; set('practiceExercises', a) }
  const addExercise = () => set('practiceExercises', [...form.practiceExercises, ''])
  const removeExercise = (i) => { if (form.practiceExercises.length === 1) return; set('practiceExercises', form.practiceExercises.filter((_, x) => x !== i)) }

  // ─── Prerequisites ────────────────────────────────────────────────────────
  const updatePrereq = (i, v) => { const a = [...form.prerequisites]; a[i] = v; set('prerequisites', a) }
  const addPrereq = () => set('prerequisites', [...form.prerequisites, ''])
  const removePrereq = (i) => { if (form.prerequisites.length === 1) return; set('prerequisites', form.prerequisites.filter((_, x) => x !== i)) }

  // ─── Additional Resources ─────────────────────────────────────────────────
  const updateResource = (i, field, val) => {
    const a = [...form.additionalResources]; a[i] = { ...a[i], [field]: val }; set('additionalResources', a)
  }
  const addResource = () => set('additionalResources', [...form.additionalResources, { label: '', url: '' }])
  const removeResource = (i) => { if (form.additionalResources.length === 1) return; set('additionalResources', form.additionalResources.filter((_, x) => x !== i)) }

  // ─── Code Sections ────────────────────────────────────────────────────────
  const addCodeSection = () => set('codeSections', [...form.codeSections, {
    title: 'New Example', language: 'c',
    initialCode: '#include <stdio.h>\n\nint main() {\n    printf("Hello World!\\n");\n    return 0;\n}'
  }])
  const updateCodeSection = (i, field, val) => {
    const a = [...form.codeSections]; a[i] = { ...a[i], [field]: val }; set('codeSections', a)
  }
  const removeCodeSection = (i) => set('codeSections', form.codeSections.filter((_, x) => x !== i))

  // ─── Submit ───────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const cleanSections = form.sections.filter(s => s.heading.trim() && s.description.trim())
      if (cleanSections.length === 0) throw new Error('At least one content section is required.')

      const payload = {
        ...form,
        topics: form.topics.filter(t => t.trim()),
        whatYoullLearn: form.whatYoullLearn.filter(t => t.trim()),
        topicsCovered: form.topicsCovered.filter(t => t.trim()),
        sections: cleanSections,
        practiceExercises: form.practiceExercises.filter(p => p.trim()),
        prerequisites: form.prerequisites.filter(p => p.trim()),
        additionalResources: form.additionalResources.filter(r => r.label.trim() || r.url.trim()),
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

  const input = "w-full px-4 py-2.5 bg-gray-800 border border-gray-600 rounded-xl text-white text-sm focus:outline-none focus:border-primary-500 transition-colors"
  const section = "border-t border-gray-700 pt-6 space-y-4"
  const sectionTitle = "text-sm font-bold text-white uppercase tracking-wider"

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* ── Meta ── */}
      <div>
        <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">Title *</label>
        <input value={form.title} onChange={e => set('title', e.target.value)} required className={input} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">Category *</label>
          <select value={form.category} onChange={e => set('category', e.target.value)} className={input}>
            {categoriesList.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">Difficulty *</label>
          <select value={form.difficulty} onChange={e => set('difficulty', e.target.value)} className={input}>
            {DIFFICULTIES.map(d => <option key={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">Duration *</label>
          <input value={form.time} onChange={e => set('time', e.target.value)} placeholder="e.g. 25 min" required className={input} />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">Description (SEO) *</label>
        <textarea value={form.description} onChange={e => set('description', e.target.value)} required rows={2} className={`${input} resize-none`} />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">Summary (Banner subtitle)</label>
        <textarea value={form.summary} onChange={e => set('summary', e.target.value)} rows={2} className={`${input} resize-none`} placeholder="Short intro shown in the purple banner..." />
      </div>

      {/* ── What You'll Learn ── */}
      <div className={section}>
        <p className={`${sectionTitle} text-emerald-400`}>🟢 What You&apos;ll Learn</p>
        <StringListBuilder
          label="Learning Outcomes"
          items={form.whatYoullLearn}
          onAdd={addLearnItem}
          onRemove={removeLearnItem}
          onChange={updateLearnItem}
          placeholder="e.g. Understand GPIO pin configuration"
          helpText="Each item appears as a checklist entry in the green 'What You'll Learn' card."
        />
      </div>

      {/* ── Topics Covered ── */}
      <div className={section}>
        <p className={`${sectionTitle} text-violet-400`}>🟣 Topics Covered</p>
        <StringListBuilder
          label="Topics Covered"
          items={form.topicsCovered}
          onAdd={addCoveredTopic}
          onRemove={removeCoveredTopic}
          onChange={updateCoveredTopic}
          placeholder="e.g. GPIO, Interrupts, PWM, Timers"
          helpText="Displayed as pill chips in the 'Topics Covered' section."
        />
      </div>

      {/* ── Content Sections ── */}
      <div className={section}>
        <div className="flex items-center justify-between">
          <div>
            <p className={sectionTitle}>📘 Content Sections</p>
            <p className="text-xs text-gray-400 mt-1">Each section renders as a card with a blue left border.</p>
          </div>
          <button type="button" onClick={addSection}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-lg text-sm hover:bg-blue-600/30 transition-colors">
            <FiPlus className="w-4 h-4" /> Add Section
          </button>
        </div>

        <div className="space-y-4">
          {form.sections.map((sec, idx) => (
            <div key={idx} className="p-4 bg-gray-800/50 border border-gray-700 rounded-xl space-y-3 relative border-l-4 border-l-blue-600">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Section {idx + 1}</span>
                <div className="flex items-center gap-1">
                  <button type="button" onClick={() => moveSection(idx, -1)} disabled={idx === 0}
                    className="p-1 text-gray-400 hover:text-white disabled:opacity-30 transition-colors">
                    <FiChevronUp className="w-4 h-4" />
                  </button>
                  <button type="button" onClick={() => moveSection(idx, 1)} disabled={idx === form.sections.length - 1}
                    className="p-1 text-gray-400 hover:text-white disabled:opacity-30 transition-colors">
                    <FiChevronDown className="w-4 h-4" />
                  </button>
                  <button type="button" onClick={() => removeSection(idx)} disabled={form.sections.length === 1}
                    className="p-1 text-red-400 hover:text-red-300 disabled:opacity-30 transition-colors">
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <input
                value={sec.heading}
                onChange={e => updateSection(idx, 'heading', e.target.value)}
                placeholder="Section Heading (e.g. What is a GPIO Pin?)"
                className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white text-sm font-semibold focus:outline-none focus:border-blue-500 transition-colors"
              />
              <textarea
                value={sec.description}
                onChange={e => updateSection(idx, 'description', e.target.value)}
                placeholder="Explain the concept in clear, plain text..."
                rows={4}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-gray-300 text-sm focus:outline-none focus:border-blue-500 transition-colors resize-y"
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── Prerequisites ── */}
      <div className={section}>
        <p className={`${sectionTitle} text-sky-400`}>🔵 Prerequisites</p>
        <StringListBuilder
          label="Prerequisites"
          items={form.prerequisites}
          onAdd={addPrereq}
          onRemove={removePrereq}
          onChange={updatePrereq}
          placeholder="e.g. Basic understanding of C syntax"
        />
      </div>

      {/* ── Practice Exercises ── */}
      <div className={section}>
        <p className={`${sectionTitle} text-amber-400`}>🟡 Practice Exercises</p>
        <StringListBuilder
          label="Practice Exercises"
          items={form.practiceExercises}
          onAdd={addExercise}
          onRemove={removeExercise}
          onChange={updateExercise}
          placeholder="e.g. Blink an LED on GPIO pin PA5"
        />
      </div>

      {/* ── Additional Resources ── */}
      <div className={section}>
        <div className="flex items-center justify-between border-b border-gray-700 pb-2">
          <div>
            <p className={`${sectionTitle} text-purple-400`}>🟣 Additional Resources</p>
            <p className="text-xs text-gray-400 mt-0.5">Shown as clickable links in a purple card.</p>
          </div>
          <button type="button" onClick={addResource}
            className="flex items-center gap-1.5 px-2 py-1 bg-purple-600/20 text-purple-400 rounded-md text-xs hover:bg-purple-600/30 transition-colors">
            <FiPlus className="w-3 h-3" /> Add Resource
          </button>
        </div>
        <div className="space-y-2 mt-2">
          {form.additionalResources.map((res, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <input
                value={res.label}
                onChange={e => updateResource(idx, 'label', e.target.value)}
                placeholder="Label (e.g. STM32 Reference Manual)"
                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
              />
              <input
                value={res.url}
                onChange={e => updateResource(idx, 'url', e.target.value)}
                placeholder="URL (https://...)"
                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
              />
              <button type="button" onClick={() => removeResource(idx)} disabled={form.additionalResources.length === 1}
                className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded disabled:opacity-30 transition-colors">
                <FiTrash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ── Code Snippets ── */}
      <div className={section}>
        <div className="flex items-center justify-between">
          <div>
            <p className={sectionTitle}><FiCode className="inline w-4 h-4 mr-1" /> Code Playgrounds</p>
            <p className="text-xs text-gray-400 mt-1">Appear in the "Interactive Code Lab" below the content.</p>
          </div>
          <button type="button" onClick={addCodeSection}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-700 text-gray-200 rounded-lg text-sm font-medium hover:bg-gray-600 transition-colors">
            <FiPlus className="w-4 h-4" /> Add Snippet
          </button>
        </div>

        <div className="space-y-6">
          {form.codeSections.map((section, idx) => (
            <div key={idx} className="p-4 bg-gray-800/50 border border-gray-700 rounded-xl space-y-3 relative">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Snippet {idx + 1}</span>
                <button type="button" onClick={() => removeCodeSection(idx)}
                  className="p-1.5 text-red-400 hover:text-white hover:bg-red-500 rounded transition-colors">
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
              <input
                value={section.title}
                onChange={e => updateCodeSection(idx, 'title', e.target.value)}
                placeholder="e.g. Example 1: Blink LED"
                className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500"
              />
              <div className="h-[300px] border border-gray-700 rounded-lg overflow-hidden">
                <Editor
                  height="100%"
                  language={section.language}
                  theme="vs-dark"
                  value={section.initialCode}
                  onChange={val => updateCodeSection(idx, 'initialCode', val)}
                  options={{ minimap: { enabled: false }, fontSize: 14, padding: { top: 16 }, scrollBeyondLastLine: false }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Featured ── */}
      <div className="border-t border-gray-700 pt-4">
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)}
            className="w-4 h-4 rounded border-gray-600 accent-primary-600" />
          <span className="text-sm text-gray-300">Mark as Featured</span>
        </label>
      </div>

      {error && (
        <p className="text-red-400 text-sm bg-red-900/20 px-4 py-3 rounded-xl border border-red-800">{error}</p>
      )}

      <div className="flex gap-3 pt-4">
        <button type="button" onClick={onCancel}
          className="flex-1 px-6 py-2.5 bg-gray-800 border border-gray-700 text-gray-300 rounded-xl text-sm hover:bg-gray-700 transition-colors">
          Cancel
        </button>
        <button type="submit" disabled={loading}
          className="flex-1 px-6 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
          {loading && <FiLoader className="w-4 h-4 animate-spin" />}
          {isNew ? 'Create Tutorial' : 'Save Changes'}
        </button>
      </div>
    </form>
  )
}
