'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useUser } from '@/context/UserContext'
import TutorialForm from '@/components/admin/TutorialForm'
import { FiPlus, FiEdit2, FiTrash2, FiLoader, FiMenu, FiSave, FiChevronDown } from 'react-icons/fi'

export default function AdminTutorialsPage() {
  const { user, hydrated } = useUser()
  const [courses, setCourses] = useState([])
  const [activeCourse, setActiveCourse] = useState('')
  const [tutorials, setTutorials] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [editing, setEditing] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [orderChanged, setOrderChanged] = useState(false)

  const dragIdx = useRef(null)
  const dragOverIdx = useRef(null)

  const getHeaders = useCallback(() => ({
    'x-user-role': user?.role || '',
    'x-user-email': user?.email || '',
  }), [user])

  // Load courses
  useEffect(() => {
    fetch('/api/courses')
      .then(r => r.json())
      .then(json => {
        if (json.success && json.data.length > 0) {
          setCourses(json.data)
          setActiveCourse(json.data[0].slug)
        }
      })
      .catch(console.error)
  }, [])

  // Load tutorials for selected course
  const fetchTutorials = useCallback(async () => {
    if (!hydrated || !activeCourse) return
    setLoading(true)
    setOrderChanged(false)
    try {
      const res = await fetch(`/api/tutorials?course=${activeCourse}&limit=200`, { headers: getHeaders() })
      const json = await res.json()
      if (json.success) setTutorials(json.data.tutorials || [])
    } catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }, [activeCourse, hydrated, getHeaders])

  useEffect(() => { fetchTutorials() }, [fetchTutorials])

  /* ── Drag-to-reorder ── */
  const onDragStart = (idx) => { dragIdx.current = idx }
  const onDragEnter = (idx) => { dragOverIdx.current = idx }
  const onDragEnd = () => {
    const from = dragIdx.current
    const to = dragOverIdx.current
    if (from === null || to === null || from === to) return
    const reordered = [...tutorials]
    const [moved] = reordered.splice(from, 1)
    reordered.splice(to, 0, moved)
    setTutorials(reordered)
    setOrderChanged(true)
    dragIdx.current = null
    dragOverIdx.current = null
  }

  /* ── Save order ── */
  const saveOrder = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/tutorials', {
        method: 'PATCH',
        headers: { ...getHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderedIds: tutorials.map(t => t._id) }),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      setOrderChanged(false)
    } catch (e) { alert(e.message) }
    finally { setSaving(false) }
  }

  /* ── Delete ── */
  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleteLoading(true)
    try {
      const res = await fetch(`/api/tutorials/${deleteTarget.slug}`, {
        method: 'DELETE',
        headers: getHeaders(),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      setDeleteTarget(null)
      fetchTutorials()
    } catch (e) { alert(e.message) }
    finally { setDeleteLoading(false) }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Tutorial Modules</h1>
          <p className="text-gray-400 text-sm mt-0.5">Drag rows to reorder modules within a course.</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {orderChanged && (
            <button
              onClick={saveOrder}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-colors"
            >
              {saving ? <FiLoader className="w-4 h-4 animate-spin" /> : <FiSave className="w-4 h-4" />}
              Save Order
            </button>
          )}
          <button
            onClick={() => setEditing('new')}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold transition-colors"
          >
            <FiPlus className="w-4 h-4" /> Add Module
          </button>
        </div>
      </div>

      {error && <div className="bg-red-900/30 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm mb-4">{error}</div>}

      {/* Course filter tabs */}
      {courses.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6 pb-4 border-b border-gray-800">
          {courses.map(c => (
            <button
              key={c.slug}
              onClick={() => setActiveCourse(c.slug)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all ${
                activeCourse === c.slug
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-gray-900 text-gray-400 border-gray-700 hover:border-primary-500 hover:text-white'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      )}

      {/* Module list */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <FiLoader className="w-6 h-6 animate-spin text-gray-500" />
          </div>
        ) : tutorials.length === 0 ? (
          <p className="text-center text-gray-500 py-12 text-sm">No modules for this course yet.</p>
        ) : (
          <table className="w-full">
            <thead className="border-b border-gray-800">
              <tr>
                <th className="w-10 px-3 py-3" />
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase">#</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Module Title</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Articles</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Slug</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tutorials.map((tut, idx) => (
                <tr
                  key={tut._id}
                  draggable
                  onDragStart={() => onDragStart(idx)}
                  onDragEnter={() => onDragEnter(idx)}
                  onDragEnd={onDragEnd}
                  onDragOver={e => e.preventDefault()}
                  className="border-b border-gray-800/50 hover:bg-gray-800/40 transition-colors cursor-grab active:cursor-grabbing group"
                >
                  <td className="px-3 py-3 text-gray-600 group-hover:text-gray-400">
                    <FiMenu className="w-4 h-4" />
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-sm">{idx + 1}</td>
                  <td className="px-4 py-3 font-semibold text-white">{tut.title}</td>
                  <td className="px-4 py-3 text-gray-400 text-sm">{tut.articles?.length || 0} articles</td>
                  <td className="px-4 py-3 text-gray-500 font-mono text-xs">{tut.slug}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setEditing(tut)}
                        className="p-1.5 text-gray-400 hover:text-primary-400 hover:bg-primary-900/20 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(tut)}
                        className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
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
        )}
      </div>

      {/* Edit / Add Modal */}
      {editing !== null && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-2xl shadow-2xl my-8">
            <h2 className="text-white font-bold text-lg mb-5">
              {editing === 'new' ? 'Add Module' : `Edit: ${editing.title}`}
            </h2>
            <TutorialForm
              initial={editing === 'new' ? {} : editing}
              isNew={editing === 'new'}
              endpoint="/api/tutorials"
              headers={getHeaders()}
              onSuccess={() => { setEditing(null); fetchTutorials() }}
              onCancel={() => setEditing(null)}
            />
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h2 className="text-white font-bold text-base mb-2">Delete Module?</h2>
            <p className="text-gray-400 text-sm mb-1">
              <span className="text-white font-semibold">{deleteTarget.title}</span>
            </p>
            <p className="text-gray-500 text-sm mb-6">Articles mapped to this module will not be deleted, but they will become unlinked.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteTarget(null)} className="px-4 py-2 text-gray-400 hover:bg-gray-800 rounded-xl text-sm">Cancel</button>
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold flex items-center gap-2"
              >
                {deleteLoading ? <FiLoader className="w-4 h-4 animate-spin" /> : <FiTrash2 className="w-4 h-4" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
