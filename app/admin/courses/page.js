'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useUser } from '@/context/UserContext'
import CourseForm from '@/components/admin/CourseForm'
import { FiPlus, FiEdit2, FiTrash2, FiLoader, FiMenu, FiSave } from 'react-icons/fi'

export default function AdminCoursesPage() {
  const { user, hydrated } = useUser()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [editing, setEditing] = useState(null)   // null | 'new' | course obj
  const [deleteId, setDeleteId] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [orderChanged, setOrderChanged] = useState(false)

  // Drag state (no external lib)
  const dragIdx = useRef(null)
  const dragOverIdx = useRef(null)

  const getHeaders = useCallback(() => ({
    'x-user-role': user?.role || '',
    'x-user-email': user?.email || '',
  }), [user])

  const fetchCourses = useCallback(async () => {
    if (!hydrated) return
    setLoading(true)
    try {
      const res = await fetch('/api/courses', { headers: getHeaders() })
      const json = await res.json()
      if (json.success) setCourses(json.data)
    } catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }, [hydrated, getHeaders])

  useEffect(() => { fetchCourses() }, [fetchCourses])

  /* ── Drag-to-reorder handlers ── */
  const onDragStart = (idx) => { dragIdx.current = idx }
  const onDragEnter = (idx) => { dragOverIdx.current = idx }
  const onDragEnd = () => {
    const from = dragIdx.current
    const to = dragOverIdx.current
    if (from === null || to === null || from === to) return
    const reordered = [...courses]
    const [moved] = reordered.splice(from, 1)
    reordered.splice(to, 0, moved)
    setCourses(reordered)
    setOrderChanged(true)
    dragIdx.current = null
    dragOverIdx.current = null
  }

  /* ── Save reordered order to DB ── */
  const saveOrder = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/courses', {
        method: 'PATCH',
        headers: { ...getHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderedIds: courses.map(c => c._id) }),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      setOrderChanged(false)
    } catch (e) { alert(e.message) }
    finally { setSaving(false) }
  }

  /* ── Delete ── */
  const handleDelete = async () => {
    if (!deleteId) return
    setDeleteLoading(true)
    try {
      const res = await fetch(`/api/courses/${deleteId}`, { method: 'DELETE', headers: getHeaders() })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      setDeleteId(null)
      fetchCourses()
    } catch (e) { alert(e.message) }
    finally { setDeleteLoading(false) }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Courses</h1>
          <p className="text-gray-400 text-sm mt-0.5">Drag rows to reorder how courses appear on the site.</p>
        </div>
        <div className="flex items-center gap-3">
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
            <FiPlus className="w-4 h-4" /> Add Course
          </button>
        </div>
      </div>

      {error && <div className="bg-red-900/30 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm mb-4">{error}</div>}

      {/* Course list */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <FiLoader className="w-6 h-6 animate-spin text-gray-500" />
          </div>
        ) : courses.length === 0 ? (
          <p className="text-center text-gray-500 py-12 text-sm">No courses yet. Add one above.</p>
        ) : (
          <table className="w-full">
            <thead className="border-b border-gray-800">
              <tr>
                <th className="w-10 px-4 py-3" />
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase">#</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Course Name</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Slug</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course, idx) => (
                <tr
                  key={course._id}
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
                  <td className="px-4 py-3 font-semibold text-white">{course.name}</td>
                  <td className="px-4 py-3 text-gray-400 font-mono text-xs">{course.slug}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setEditing(course)}
                        className="p-1.5 text-gray-400 hover:text-primary-400 hover:bg-primary-900/20 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteId(course._id)}
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
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-white font-bold text-lg mb-5">
              {editing === 'new' ? 'Add Course' : `Edit: ${editing.name}`}
            </h2>
            <CourseForm
              initial={editing === 'new' ? {} : editing}
              isNew={editing === 'new'}
              endpoint="/api/courses"
              headers={getHeaders()}
              onSuccess={() => { setEditing(null); fetchCourses() }}
              onCancel={() => setEditing(null)}
            />
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h2 className="text-white font-bold text-base mb-2">Delete Course?</h2>
            <p className="text-gray-400 text-sm mb-6">This will permanently delete the course. Modules and articles under it will remain but become unlinked.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 text-gray-400 hover:bg-gray-800 rounded-xl text-sm">Cancel</button>
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
