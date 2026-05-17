'use client'

import { useState, useEffect } from 'react'
import { FiSave, FiLoader, FiX, FiPlus, FiMenu } from 'react-icons/fi'

export default function TutorialForm({ initial = {}, isNew, endpoint, headers, onSuccess, onCancel }) {
  const [form, setForm] = useState({
    title: initial.title || '',
    course: initial.course || '',
    description: initial.description || '',
    articles: initial.articles || [] // array of object IDs
  })
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  const [coursesList, setCoursesList] = useState([])
  const [allArticles, setAllArticles] = useState([])
  const [selectedArticleId, setSelectedArticleId] = useState('')

  useEffect(() => {
    // Fetch courses
    fetch('/api/courses')
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data.length > 0) {
          setCoursesList(json.data)
          if (!form.course) setForm(f => ({ ...f, course: json.data[0].slug }))
        }
      })
      .catch(err => console.error('Failed to load courses', err))

    // Fetch all articles
    fetch('/api/articles?limit=1000') // fetch all to map
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          setAllArticles(json.data.articles || [])
        }
      })
      .catch(err => console.error('Failed to load articles', err))
  }, [])

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const handleAddArticle = () => {
    if (!selectedArticleId) return
    // Prevent duplicates
    if (!form.articles.some(id => id === selectedArticleId || (id._id && id._id === selectedArticleId))) {
      // Find full article to store (in case it was populated initially)
      const articleToAdd = allArticles.find(a => a._id === selectedArticleId) || selectedArticleId
      set('articles', [...form.articles, articleToAdd])
    }
    setSelectedArticleId('')
  }

  const handleRemoveArticle = (index) => {
    set('articles', form.articles.filter((_, i) => i !== index))
  }

  const moveArticle = (index, direction) => {
    const newArticles = [...form.articles]
    const swapIndex = index + direction
    if (swapIndex < 0 || swapIndex >= newArticles.length) return
    const temp = newArticles[index]
    newArticles[index] = newArticles[swapIndex]
    newArticles[swapIndex] = temp
    set('articles', newArticles)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    // Map articles back to just their IDs for the API request
    const payload = {
      ...form,
      articles: form.articles.map(a => a._id || a)
    }

    try {
      // For updates, use slug-based endpoint; for new, POST to base endpoint
      const id = initial.slug || initial._id
      const url = isNew ? endpoint : `${endpoint}/${id}`
      const res = await fetch(url, {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify(payload)
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error || 'Failed to save tutorial module')
      onSuccess()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const input = "w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all placeholder:text-gray-600"
  
  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in relative">
      {error && (
        <div className="bg-red-900/30 border border-red-500/50 text-red-400 p-4 rounded-xl text-sm flex items-center gap-3">
          <FiX className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Basic Info */}
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">Module Title *</label>
          <input value={form.title} onChange={e => set('title', e.target.value)} required className={input} placeholder="e.g. Getting Started with C" />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">Parent Course *</label>
          <select value={form.course} onChange={e => set('course', e.target.value)} className={input}>
            {coursesList.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">Description</label>
          <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={3} className={input} placeholder="Brief description of this module..." />
        </div>
      </div>

      {/* Map Articles */}
      <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700">
        <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wide">Map Articles to this Module</h3>
        
        {/* Add Article Control */}
        <div className="flex gap-2 mb-6">
          <select 
            value={selectedArticleId} 
            onChange={(e) => setSelectedArticleId(e.target.value)} 
            className={input}
          >
            <option value="">-- Select an Article to Add --</option>
            {allArticles.map(a => (
              <option key={a._id} value={a._id}>{a.title}</option>
            ))}
          </select>
          <button 
            type="button" 
            onClick={handleAddArticle}
            disabled={!selectedArticleId}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl flex items-center gap-2 disabled:opacity-50 transition-colors"
          >
            <FiPlus /> Add
          </button>
        </div>

        {/* List of mapped articles */}
        {form.articles.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-gray-700 rounded-xl text-gray-500 text-sm">
            No articles mapped yet. Add some articles to build this tutorial module.
          </div>
        ) : (
          <div className="space-y-2">
            {form.articles.map((article, index) => {
              // Handle populated article vs just ID
              const articleObj = typeof article === 'string' ? allArticles.find(a => a._id === article) : article;
              const title = articleObj ? articleObj.title : 'Loading...';
              
              return (
                <div key={index} className="flex items-center gap-3 bg-gray-900 border border-gray-700 rounded-xl p-3">
                  <div className="text-gray-500 px-2 cursor-grab flex flex-col gap-1 items-center">
                    <button type="button" onClick={() => moveArticle(index, -1)} disabled={index === 0} className="hover:text-white disabled:opacity-30">▲</button>
                    <button type="button" onClick={() => moveArticle(index, 1)} disabled={index === form.articles.length - 1} className="hover:text-white disabled:opacity-30">▼</button>
                  </div>
                  <span className="text-gray-400 font-mono text-xs w-6">{index + 1}.</span>
                  <span className="flex-1 text-sm text-gray-200 font-medium">{title}</span>
                  <button type="button" onClick={() => handleRemoveArticle(index)} className="text-red-400/50 hover:text-red-400 p-2 transition-colors">
                    <FiX />
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Sticky Bottom Actions */}
      <div className="sticky bottom-0 bg-gray-800/90 backdrop-blur-xl border-t border-gray-700 p-4 -mx-6 -mb-6 flex gap-3 mt-8">
        <button type="button" onClick={onCancel} className="flex-1 px-6 py-2.5 bg-gray-700 text-white rounded-xl text-sm font-semibold hover:bg-gray-600 transition-colors">
          Cancel
        </button>
        <button type="submit" disabled={loading} className="flex-1 px-6 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
          {loading ? <FiLoader className="w-4 h-4 animate-spin" /> : <FiSave className="w-4 h-4" />}
          {isNew ? 'Create Module' : 'Save Changes'}
        </button>
      </div>
    </form>
  )
}
